import { createSlice, PayloadAction, } from "@reduxjs/toolkit"
import { IPortfoliosState, IStockItem, IPortfolioState } from "./types";
import uuid from "uuid/v4";
import { getQuoteEndpoint } from '../../api/AlphaVantageApi';

import { RawStockItem, WarningResult } from "../../api/AlphaVantageApi/types";
import { updateStockItemFromRaw } from "../../helpers/StoreTypeConverter";
import { RatesMapping } from "../../api/CBR/types";
import { endFetching, beginFetching } from "../Base/FetchingBase";
import { AppThunk } from "../types";
import { updatePortfolioSumAndDelta } from "./helpers";

function getSelectedPortfolio(state: IPortfoliosState) {
    return state.list.find(v => v.id === state.currentPortfolioId)!;
}

export const initialState: IPortfoliosState = {
    currentPortfolioId: '',
    list: [],
    isFetching: false
}

export const initialPortfolio: IPortfolioState = {
    id: 'none',
    name: 'none',
    savedItems: [],
    marketValue: 0,
    deltaP: 0,

    isFetching: false,
    didInvalidate: true,
    apiLastError: false
}

//PortfioMutations - изменяет параметр state - т.к. они используются внутри createSlicе, такая логика допустима благодоря Immer
const portfoliosSlice = createSlice({
    name: 'portfolios',
    initialState,
    reducers: {
        selectCurrentPortfolio(state, { payload: currentPortfolioId }: PayloadAction<string>) {
            state.currentPortfolioId = currentPortfolioId;
        },
        createPortfolio(state, action: PayloadAction<string>) {
            const newId = uuid();
            state.list.push({
                ...initialPortfolio,
                id: newId,
                name: action.payload,
            });

            state.currentPortfolioId = newId;
        },
        saveStockItem(state, { payload: { item, rates } }: PayloadAction<{ item: IStockItem, rates: RatesMapping }>) {
            const portfolioState = getSelectedPortfolio(state);
            //туду сумму сделать
            const index = portfolioState.savedItems.findIndex(v => v.symbol === item.symbol);

            if (index === -1) {
                portfolioState.savedItems.push(item);
            } else {
                portfolioState.savedItems[index].amount += item.amount;
                
                portfolioState.savedItems[index].didInvalidate = true;
                portfolioState.savedItems[index].apiLastError = false;
                portfolioState.savedItems[index].deltaP = item.deltaP;
                
                const { amount, currentPrice } = portfolioState.savedItems[index];
                portfolioState.savedItems[index].marketValue = (amount * (currentPrice * 100))/100;
            }
            updatePortfolioSumAndDelta(portfolioState, rates);
        },

        recieveStockItemUpdate(state, { payload: rawItem }: PayloadAction<RawStockItem>) {
            const { savedItems } = getSelectedPortfolio(state);
            const oldItemIndex = savedItems.findIndex(v => v.symbol === rawItem["Global Quote"]["01. symbol"]);
            let newStockItem = updateStockItemFromRaw(savedItems[oldItemIndex], rawItem)
            savedItems[oldItemIndex] = endFetching(newStockItem);;
        },

        recieveStockItemError(state, { payload }: PayloadAction<{ error: string, symbol: string }>) {
            const { savedItems } = getSelectedPortfolio(state);
            const oldItemIndex = savedItems.findIndex(v => v.symbol === payload.symbol);
            const newStockItem = endFetching(savedItems[oldItemIndex], payload.error);
            savedItems[oldItemIndex] = newStockItem;
        },

        requestPortfolioUpdate(state, action: PayloadAction<void>) {
            state.isFetching = true;
            const portfolioSate = getSelectedPortfolio(state);
            portfolioSate.savedItems = portfolioSate.savedItems.map(item => beginFetching(item));

            beginFetching(portfolioSate);
        },

        receivePortfolioUpdate(state, { payload: rates }: PayloadAction<RatesMapping>) {
            const portfolioSate = getSelectedPortfolio(state);

            endFetching(portfolioSate, portfolioSate.apiLastError);
            state.isFetching = false;

            if (portfolioSate.apiLastError === false) {
                //сумма стоимости
                updatePortfolioSumAndDelta(portfolioSate, rates);
            }
        },

        receiveApiError(state, { payload: apiLastError }: PayloadAction<string>) {
            const portfolioSate = getSelectedPortfolio(state);

            portfolioSate.apiLastError = apiLastError;
            portfolioSate.didInvalidate = false;
        },

        abortUpdatig(state, action: PayloadAction<void>) {
            const portfolioSate = getSelectedPortfolio(state);
            const abortErrorMessage = 'Обновление было прервано';

            state.isFetching = false;
            endFetching(portfolioSate, abortErrorMessage);
            portfolioSate.savedItems = portfolioSate.savedItems.map(item => endFetching(item, abortErrorMessage));
        }
    }
});


const { actions, reducer } = portfoliosSlice;

export const { abortUpdatig, recieveStockItemError, receiveApiError, createPortfolio, selectCurrentPortfolio, saveStockItem, recieveStockItemUpdate, requestPortfolioUpdate, receivePortfolioUpdate } = actions;

export function wrongDataErrorMessage(data: any, symbol: string) {
    return `Не удалось привести тип ${typeof data} к RawStockItem для символа ${symbol}. 
            Сырой объект data: ${JSON.stringify(data)}`;
}

export const fetchCurrentPortfolio = (): AppThunk<Promise<void>> =>
    async (dispatch, getState) => {
        const state = getState().portfolios;
        const rates = getState().exchangeRates.rates;

        const { savedItems } = getSelectedPortfolio(state);

        //включить спинер что мы обновляем
        //и на каждой stockItem
        dispatch(requestPortfolioUpdate())

        const stockItemsRequests = savedItems
            .map(async ({ symbol }) => {

                try {
                    const { data } = await getQuoteEndpoint(symbol);

                    const warning = data as WarningResult;
                    const result = data as RawStockItem;

                    if (warning.Note) {
                        throw warning.Note;
                    }

                    if (!result["Global Quote"]) { 
                        throw wrongDataErrorMessage(data, symbol);
                    }

                    dispatch(recieveStockItemUpdate(result));
                } catch (error) {
                    dispatch(recieveStockItemError({ error: error.toString(), symbol }))
                    dispatch(receiveApiError(error.toString()));
                } finally {
                    return Promise.resolve();
                }
            });

        //Обновлять каждый:
        //+: красиво, медленее 
        //-: каждый раз пересоздается весь массив

        //Обновлять все:
        //+: одно изменение массива, быстрее
        //-: безполезное свойство isFetching, пользователю меньше фидбека

        //ждем когда все обновятся
        await Promise.all(stockItemsRequests);
        //выключаем общий спинер, обновляем общую стоимость;
        dispatch(receivePortfolioUpdate(rates));
    }


export const portfoliosReducer = reducer;