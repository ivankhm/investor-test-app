import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit"
import { IPortfoliosState, IStockItem } from "./types";
import uuid from "uuid/v4";
import * as AlphaAdvantageApi from '../../api/AlphaAdvantageApi';

import { RawStockItem, WarningResult } from "../../api/AlphaAdvantageApi/types";
import { RootState } from "..";
import { updateStockItemFromRaw } from "../../helpers/StoreTypeConverter";
import { RatesMapping } from "../../api/CBR/types";

/**
*  короч
*    чо надо
*
*    portfolios
*        selectCurrentPortfolio ?
*        createPortfolio
*
*/

function getSelectedPortfolio(state: IPortfoliosState) {
    return state.list.find(v => v.id === state.currentPortfolioId)!;
}

//PortfioMutations - изменяет параметр state - т.к. они используются внутри createSlicе, такая логика допустима благодоря Immer
const portfoliosSlice = createSlice({
    name: 'portfolios',
    initialState: {
        currentPortfolioId: '',
        list: [],
        isFetching: false,
        apiError: false
    } as IPortfoliosState,
    reducers: {
        selectCurrentPortfolio(state, action: PayloadAction<string>) {
            state.currentPortfolioId = action.payload;
        },
        createPortfolio(state, action: PayloadAction<string>) {
            let newId = uuid();
            state.list.push({
                id: newId,
                name: action.payload,
                savedItems: [],
                marketValue: 0,
                deltaP: 0,

                lastUpdated: 0,
                isFetching: false
            });

            state.currentPortfolioId = newId;
        },
        saveStockItem(state, action: PayloadAction<IStockItem>) {
            const portfolioState = getSelectedPortfolio(state);
            //туду сумму сделать
            portfolioState.savedItems.push(action.payload);

        },
        recieveStockItemUpdate(state, { payload }: PayloadAction<RawStockItem>) {
            const { savedItems } = getSelectedPortfolio(state);

            let oldItemIndex = savedItems.findIndex(v => v.symbol === payload["Global Quote"]["01. symbol"]);

            let newStockItem = updateStockItemFromRaw(savedItems[oldItemIndex], payload)
            newStockItem.isFetching = false;

            savedItems[oldItemIndex] = newStockItem;
        },
        requestPortfolioUpdate(state, action: PayloadAction<void>) {
            const portfolioState = getSelectedPortfolio(state);
            portfolioState.isFetching = true;
            portfolioState.savedItems.forEach(v => v.isFetching = true);


        },
        receivePortfolioUpdate(state, { payload }: PayloadAction<{ oldMarketValue: number, rates: RatesMapping }>) {
            const portfolioState = getSelectedPortfolio(state);
            //флаги для спинеров и т.д.
            portfolioState.isFetching = false;

            //сумма стоимости
            console.log('savedItems: ', portfolioState.savedItems);
            console.log('rates: ', payload.rates);

            console.log('payload.oldMarketValue: ', payload.oldMarketValue);


            portfolioState.marketValue = getPortolioSum(portfolioState.savedItems, payload.rates);
            console.log('marketValue: ', portfolioState.marketValue);
            console.log('после пересчета oMV: ', payload.oldMarketValue);

            //  n - x y
            //  x    100
            //

            portfolioState.deltaP = Math.round(((payload.oldMarketValue - portfolioState.marketValue) / (portfolioState.marketValue)) * 100) / 10000 ;

            portfolioState.lastUpdated = Date.now();
        },
        receiveApiError(state, { payload }: PayloadAction<string | false>) {
            console.log('receiveapierror');

            state.apiError = payload;

        }
    }
});

function getPortolioSum(savedItems: IStockItem[], rates: RatesMapping): number {
    const result = savedItems
        .map(i => {
            const { Value, Nominal } = rates[i.currency];
            return Math.round(((i.marketValue * 100) * (Value * 100) / Nominal) / 100) / 100;
        }) //переводим в рубли
        .reduce((acc, cur) => ((acc * 100) + (cur * 100)) / 100); //просто счтитаем сумму
    return result;
}

const { actions, reducer } = portfoliosSlice;

export const { receiveApiError, createPortfolio, selectCurrentPortfolio, saveStockItem, recieveStockItemUpdate, requestPortfolioUpdate, receivePortfolioUpdate } = actions;

//для тестирования онли
async function delay(delayInms: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

export const fetchCurrentPortfolio =
    (): ThunkAction<void, RootState, null, Action<string>> =>
        async (dispatch, getState) => {
            const state = getState().portfolios;
            const rates = getState().exchangeRates.rates;

            const { savedItems, marketValue: oldMarketValue } = getSelectedPortfolio(state);

            console.table('Saved Items', savedItems);

            //включить спинер что мы обновляем
            //и на каждой stockItem
            dispatch(requestPortfolioUpdate())

            const stockItemsRequests = savedItems
                .map(async ({ symbol }) => {
                    try {

                        //tsting
                        await delay(5000 + Math.random() * 5000);

                        AlphaAdvantageApi.getQuoteEndpoint(symbol)
                            .then(({ data }) => {
                                const warning = data as WarningResult;
                                console.log('updated: ', data);

                                if (warning.Note) {
                                    throw warning.Note;
                                }
                                console.log('after throw');

                                dispatch(recieveStockItemUpdate(data as RawStockItem));
                                dispatch(receiveApiError(false));


                            })
                            .catch((error: string) => {
                                console.log('error: ', error);

                                dispatch(receiveApiError(error));
                            });
                    } catch (error) {
                        console.log(error);

                    }
                });

            //Обновлять каждый:
            //+: красиво, 
            //-: каждый раз пересоздается весь массив ватафак

            //Обновлять все:
            //+: одно изменение массива
            //-: безполезное свойство isFetching, пользователю меньше фидбека

            //ждем когда все обновятся
            await Promise.all(stockItemsRequests);

            //выключаем общий спинер, обновляем общую стоимость;
            dispatch(receivePortfolioUpdate({ oldMarketValue, rates }));
        }


export const portfoliosReducer = reducer;