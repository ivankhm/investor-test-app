import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit";
import { IPortfolioState, Currrency, IStockItem } from './types'


import uuid from 'uuid/v4'
import { RootState } from "../..";
import { RawStockItem } from "../../../api/AlphaAdvantageApi/types";
import { updateStockItemFromRaw } from "../../../helpers/StoreTypeConverter";
import { portfoliosReducer } from "..";

/**
 * 
 * portfolio
 *
 *        saveStockItem
 *
 *        invalidatePortfolio
 *
 *        requestUpdate
 *
 *        receiveUpdate
 *
 *        //helper function
 *        обработать когда ВСЕ обновились, пересчитать цену
 */


export function saveStockItem(state: IPortfolioState, payload: IStockItem) {
    //todo: решить что с валютами

    state.savedItems.push(payload);
};

export function recieveStockItemUpdate({ savedItems }: IPortfolioState, payload: RawStockItem) {
    //todo: чекнуть работает ли 
    let oldItemIndex = savedItems.findIndex(v => v.symbol === payload["Global Quote"]["01. symbol"]);

    let newStockItem = updateStockItemFromRaw(savedItems[oldItemIndex], payload)
    newStockItem.isFetching = false;

    savedItems[oldItemIndex] = newStockItem;
};

export function requestPortfolioUpdate(state: IPortfolioState) {
    state.isFetching = true;
    state.savedItems.forEach(v => v.isFetching = true);
};

export function receivePortfolioUpdate(state: IPortfolioState, payload: number ) {
    //флаги для спинеров и т.д.
    state.isFetching = false;

    //сумма стоимости
    state.marketValue = state.savedItems
        .map(i => i.marketValue)
        .reduce((acc, cur) => acc + cur);

    console.log('payload: ', payload);
    console.log('marketValue: ', state.marketValue);
    
    //  n - x y
    //  x    100
    //
    state.deltaP = (payload - state.marketValue) / (state.marketValue * 100);
    state.lastUpdated = Date.now();
    
};

//fetchPortfolio
/*
export const fetchPortfolio =
    (portfolio: IPortfolioState): ThunkAction<void, RootState, null, Action<string>> =>
        async (dispatch, getState) => {

            //включить спинер что мы обновляем
            dispatch(requestPortfolioUpdate(portfolio, { portfolio.id }))

            let newStockItems = portfolio.savedItems
                .map(async ({ symbol }) => {

                    let { data } = await AlphaAdvantageApi.getQuoteEndpoint(symbol);

                    dispatch(updateStockItem(portfolio, data));

                });

            //Обновлять каждый:
            //+: красиво, 
            //-: каждый раз пересоздается весь массив ватафак

            //Обновлять все:
            //+: одно изменение массива
            //-: безполезное свойство isFetching, пользователю меньше фидбека

            //ждем когда все обновятся
            await Promise.all(newStockItems);

            //выключаем общий спинер, обновляем общую стоимость;
            dispatch(receivePortfolioUpdate({ oldMarketValue: portfolio.marketValue }));
        }
*/
        //fetchNewStockItem?????
