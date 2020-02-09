import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit"
import { IPortfoliosState, IStockItem } from "./types";
import uuid from "uuid/v4";
import * as AlphaAdvantageApi from '../../api/AlphaVantageApi';

import { RawStockItem, WarningResult } from "../../api/AlphaVantageApi/types";
import { RootState } from "..";
import { updateStockItemFromRaw } from "../../helpers/StoreTypeConverter";
import { RatesMapping } from "../../api/CBR/types";
import { endFetching, beginFetching } from "../Base/FetchingBase";

function getSelectedPortfolio(state: IPortfoliosState) {
    return state.list.find(v => v.id === state.currentPortfolioId)!;
}

function getSelectedPortfolioIndex(state: IPortfoliosState) {
    return state.list.findIndex(v => v.id === state.currentPortfolioId)!;
}

//PortfioMutations - изменяет параметр state - т.к. они используются внутри createSlicе, такая логика допустима благодоря Immer
const portfoliosSlice = createSlice({
    name: 'portfolios',
    initialState: {
        currentPortfolioId: '',
        list: [],
        isFetching: false
    } as IPortfoliosState,
    reducers: {
        selectCurrentPortfolio(state, { payload: currentPortfolioId }: PayloadAction<string>) {
            state.currentPortfolioId = currentPortfolioId;
        },
        createPortfolio(state, action: PayloadAction<string>) {
            const newId = uuid();
            state.list.push({
                id: newId,
                name: action.payload,
                savedItems: [],
                marketValue: 0,
                deltaP: 0,

                isFetching: false,
                didInvalidate: true,
                apiLastError: false
            });

            state.currentPortfolioId = newId;
        },
        saveStockItem(state, { payload }: PayloadAction<IStockItem>) {
            const portfolioState = getSelectedPortfolio(state);
            //туду сумму сделать
            const index = portfolioState.savedItems.findIndex(v => v.symbol === payload.symbol);

            if (index === -1) {
                portfolioState.savedItems.push(payload);
            } else {
                portfolioState.savedItems[index].amount += payload.amount;

                const { amount, currentPrice } = portfolioState.savedItems[index];
                portfolioState.savedItems[index].marketValue = amount * currentPrice;
            }
        },

        recieveStockItemUpdate(state, { payload }: PayloadAction<RawStockItem>) {
            const { savedItems } = getSelectedPortfolio(state);

            const oldItemIndex = savedItems.findIndex(v => v.symbol === payload["Global Quote"]["01. symbol"]);

            let newStockItem = updateStockItemFromRaw(savedItems[oldItemIndex], payload)

            newStockItem = endFetching(newStockItem);

            savedItems[oldItemIndex] = newStockItem;
        },

        recieveStockItemError(state, { payload }: PayloadAction<{ error: string, symbol: string }>) {
            const { savedItems } = getSelectedPortfolio(state);
            const oldItemIndex = savedItems.findIndex(v => v.symbol === payload.symbol);
            const newStockItem = endFetching(savedItems[oldItemIndex], payload.error);
            savedItems[oldItemIndex] = newStockItem;
        },

        requestPortfolioUpdate(state, action: PayloadAction<void>) {
            state.isFetching = true;
            const index = getSelectedPortfolioIndex(state);
            state.list[index] = beginFetching(state.list[index]);
            state.list[index].savedItems = state.list[index].savedItems.map(item => beginFetching(item));
        },

        receivePortfolioUpdate(state, { payload }: PayloadAction<{ oldMarketValue: number, rates: RatesMapping }>) {
            console.log('Обновление всего портфеля');

            const index = getSelectedPortfolioIndex(state);
            const portfolioState = state.list[index];

            state.list[index] = endFetching(portfolioState, portfolioState.apiLastError);
            state.isFetching = false;

            if (portfolioState.apiLastError === false) {
                //сумма стоимости
                portfolioState.marketValue = getPortolioSum(portfolioState.savedItems, payload.rates);

                //  n - x y
                //  x    100
                //
                portfolioState.deltaP = Math.round(((payload.oldMarketValue - portfolioState.marketValue) / (portfolioState.marketValue)) * 100) / 10000;
            }

            console.log('Обновлененный state:', JSON.stringify(state));
        },
        receiveApiError(state, { payload: apiLastError }: PayloadAction<string>) {
            console.log('receiveapierror', apiLastError);
            const index = getSelectedPortfolioIndex(state);

            state.list[index] = endFetching(state.list[index], apiLastError);
            state.isFetching = false;
        },
        abortUpdatig(state, action: PayloadAction<void>) {
            state.isFetching = false;
            const index = getSelectedPortfolioIndex(state);

            state.list[index] = endFetching(state.list[index], 'Обновление было прервано');
            state.list[index].savedItems = state.list[index].savedItems.map(item => endFetching(item, 'Обновление было прервано'));
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

export const { abortUpdatig, recieveStockItemError, receiveApiError, createPortfolio, selectCurrentPortfolio, saveStockItem, recieveStockItemUpdate, requestPortfolioUpdate, receivePortfolioUpdate } = actions;

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

                    //tsting
                    //await delay(2000 + Math.random() * 2000);

                    return AlphaAdvantageApi.getQuoteEndpoint(symbol)
                        .then(({ data }) => {
                            const warning = data as WarningResult;
                            const result = data as RawStockItem;
                            console.log('updated: ', data);

                            if (warning.Note) {
                                dispatch(recieveStockItemError({ error: warning.Note, symbol }))
                                throw warning.Note;
                            }
                            //если 
                            if (!result) {
                                const message = `Не удалось привести тип ${typeof warning} к RawStockItem для символа ${symbol}. 
                                    Сырой объект data: ${JSON.stringify(data)}
                                `;
                                console.log('Редкий случай! ', 'background: #222; color: #bada55');
                                throw message;
                            }

                            dispatch(recieveStockItemUpdate(result));
                            //dispatch(receiveApiError(false));
                        })
                        .catch((error: string) => {
                            console.log('error: ', error);

                            dispatch(receiveApiError(error));
                        });

                });

            //Обновлять каждый:
            //+: красиво, 
            //-: каждый раз пересоздается весь массив ватафак

            //Обновлять все:
            //+: одно изменение массива
            //-: безполезное свойство isFetching, пользователю меньше фидбека

            //ждем когда все обновятся
            console.log('перед авейт');

            await Promise.all(stockItemsRequests);
            console.log('Дождались всех, изи бризи');

            //выключаем общий спинер, обновляем общую стоимость;
            dispatch(receivePortfolioUpdate({ oldMarketValue, rates }));
        }


export const portfoliosReducer = reducer;