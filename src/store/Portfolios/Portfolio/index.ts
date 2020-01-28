import { createSlice } from "@reduxjs/toolkit";
import { Portfolio } from './types'
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
    name: 'stockItem',
    initialState: {
        id: 0,
        name: '',
        savedItems: [],
        marketValue: 0,
        deltaP: 0,

        lastUpdated: 0,
        isFetching: false,
        didInvalidate: false
    } as Portfolio,

    reducers: {
        saveStockItem(state, action) {},

        invalidatePortfolio(state, action) {},

        requestPortfolioUpdate(state, action) {},
        receivePortfolioUpdate(state, action) {}
    }
})

//fetchPortfolios

//fetchNewStockItem?????