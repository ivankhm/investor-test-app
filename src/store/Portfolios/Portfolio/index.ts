import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit";
import { Portfolio, Currrency, StockItem } from './types'
import { AlphaAdvantageApi } from '../../../api/AlphaAdvantageApi';


import uuid from 'uuid/v4'
import { RootState } from "../..";
import { RawStockItem } from "../../../api/AlphaAdvantageApi/types";
import { updateStockItemFromRaw } from "../../../helpers/StoreTypeConverter";

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

const portfolioSlice = createSlice({
    name: 'portfolio',
    initialState: {
        id: uuid(),
        name: '',
        savedItems: [],
        marketValue: 0,
        deltaP: 0,

        lastUpdated: 0,
        isFetching: false
    } as Portfolio,

    reducers: {
        
        saveStockItem(state, action: PayloadAction<StockItem>) {
            //todo: решить что с валютами

            state.savedItems.push(action.payload);
        },

        updateStockItem({savedItems}, action: PayloadAction<RawStockItem>) {
            //todo: чекнуть работает ли 
            let oldItemIndex = savedItems.findIndex(v => v.symbol === action.payload["Global Quote"]["01. symbol"]);
            
            let newStockItem = updateStockItemFromRaw(savedItems[oldItemIndex], action.payload)
            newStockItem.isFetching = false;

            savedItems[oldItemIndex] = newStockItem; 

        },

        requestPortfolioUpdate(state, action: PayloadAction<string>) {
            state.isFetching = true;
            state.savedItems.forEach(v => v.isFetching = true);
        },

        receivePortfolioUpdate(state, action: PayloadAction<{ oldMarketValue: number }>) {
            //флаги для спинеров и т.д.
            state.isFetching = false;

            //сумма стоимости
            state.marketValue = state.savedItems
                .map(i => i.marketValue)
                .reduce((acc, cur) => acc + cur);

            state.deltaP = action.payload.oldMarketValue / state.marketValue * 100;
            state.lastUpdated = Date.now();
        },
    }
})

const { requestPortfolioUpdate, receivePortfolioUpdate, updateStockItem } = portfolioSlice.actions;

//fetchPortfolio
export const fetchPortfolio =
    (portfolio: Portfolio): ThunkAction<void, RootState, null, Action<string>> =>
        async (dispatch, getState) => {

            //включить спинер что мы обновляем
            dispatch(requestPortfolioUpdate(portfolio.id))

            let newStockItems = portfolio.savedItems
                .map(async ({symbol}) => {

                    let { data } = await AlphaAdvantageApi.getQuoteEndpoint(symbol);
                    
                    dispatch(updateStockItem(data));

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
            dispatch(receivePortfolioUpdate({oldMarketValue: portfolio.marketValue}));
        }
//fetchNewStockItem?????
