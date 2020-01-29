import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Portfolios } from "./types";
import uuid from "uuid/v4";
import { StockItem, IPortfolioState } from "./Portfolio/types";
import * as PortfolioActions from "./Portfolio";

/**
*  короч
*    чо надо
*
*    portfolios
*        selectCurrentPortfolio ?
*        createPortfolio
*
*    
*
*/

const portfoliosSlice = createSlice({
    name: 'portfolios',
    initialState: {
        selectedPortfolio: '',
        list: []
    } as Portfolios,
    reducers: {
        selectCurrentPortfolio(state, action: PayloadAction<string>) {
            state.selectedPortfolio = action.payload;
        },
        createPortfolio(state, action: PayloadAction<string>) {
            state.list.push({
                id: uuid(),
                name: action.payload,
                savedItems: [],
                marketValue: 0,
                deltaP: 0,

                lastUpdated: 0,
                isFetching: false
            });
        },
        saveStockItem(state, action: PayloadAction<{item: StockItem, portfolioId: string}>) {
            
            const portfolioState: IPortfolioState = state.list.find(v => v.id === action.payload.portfolioId)!;
            
            PortfolioActions.saveStockItem(portfolioState, action.payload.item);
        }
    }
});

export const portfoliosReducer = portfoliosSlice.reducer;