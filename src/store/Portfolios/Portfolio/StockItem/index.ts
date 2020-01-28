import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit";
import { StockItem } from './types'
import { RawStockItem } from "../../../../api/AlphaAdvantageApi/types";
import { RootState } from "../../..";

import { AlphaAdvantageApi } from '../../../../api/AlphaAdvantageApi'
import { updateStockItemFromRaw } from "../../../../helpers/StoreTypeConverter";

/**
 *        invalidateStockItem
 *        
 *        requestUpdate
 *        
 *        reciveUpdate
 *
 *        //helper function
 *        обработать json, посчитать стаф
 */

const stockItemSlice = createSlice({
    name: 'stockItem',
    initialState: {
        name: '',
        symbol: '',
        amount: 0,
        currentPrice: 0,
        marketValue: 0,
        deltaP: "0.0000%",
        currency: 'usd',

        isFetching: false,
        didInvalidate: false
    } as StockItem,

    reducers: {
        invalidateStockItem(state, action) {
            //????
        },
        requestStockItem(state, action) {
            state.isFetching = true;
        },
        reciveStockItem(state, action: PayloadAction<RawStockItem>) {
            state = updateStockItemFromRaw(state, action.payload);

            state.didInvalidate = true;
            state.isFetching = false;
        }
    }
})

const { reciveStockItem } = stockItemSlice.actions;

export const fetchStockItem = 
    (symbol: string): ThunkAction<void, RootState, null, Action<string>> => async dispatch => {
    //todo: add validation
    const rawStockItem = (await AlphaAdvantageApi.getQuoteEndpoint(symbol)).data;

    dispatch(
        reciveStockItem(rawStockItem)
    )
}