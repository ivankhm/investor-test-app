import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit"
import { IPortfoliosState } from "./types";
import uuid from "uuid/v4";
import { StockItem, IPortfolioState } from "./Portfolio/types";
import * as PortfolioMutations from "./Portfolio";
import * as AlphaAdvantageApi from '../../api/AlphaAdvantageApi';

import { RawStockItem } from "../../api/AlphaAdvantageApi/types";
import { RootState } from "..";

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
        list: []
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
        saveStockItem(state, action: PayloadAction<StockItem>) {
            const portfolioState = getSelectedPortfolio(state);

            PortfolioMutations.saveStockItem(portfolioState, action.payload);

        },
        recieveStockItemUpdate(state, action: PayloadAction<RawStockItem>) {
            const portfolioState = getSelectedPortfolio(state);

            PortfolioMutations.recieveStockItemUpdate(portfolioState, action.payload);
        },
        requestPortfolioUpdate(state, action: PayloadAction<void>) {
            const portfolioState = getSelectedPortfolio(state);

            PortfolioMutations.requestPortfolioUpdate(portfolioState);
        },
        receivePortfolioUpdate(state, action: PayloadAction<number>) {
            const portfolioState = getSelectedPortfolio(state);

            PortfolioMutations.receivePortfolioUpdate(portfolioState, action.payload);
        }
    }
});

const { actions, reducer } = portfoliosSlice;

export const { createPortfolio, selectCurrentPortfolio, saveStockItem, recieveStockItemUpdate, requestPortfolioUpdate, receivePortfolioUpdate } = actions;

export const fetchCurrentPortfolio =
    (): ThunkAction<void, RootState, null, Action<string>> =>
        async (dispatch, getState) => {
            let state = getState().portfolios;
            let { savedItems, marketValue } = getSelectedPortfolio(state);

            //включить спинер что мы обновляем
            //и на каждой stockItem
            dispatch(requestPortfolioUpdate())

            let newStockItems = savedItems
                .map(async ({ symbol }) => {
                    let { data } = await AlphaAdvantageApi.getQuoteEndpoint(symbol);
                    dispatch(recieveStockItemUpdate(data));
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
            dispatch(receivePortfolioUpdate(marketValue));
        }


export const portfoliosReducer = reducer;