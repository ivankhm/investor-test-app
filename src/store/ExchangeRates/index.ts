import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit"
import { ExchangeRates } from "./types";
import { RootState } from "..";

//день
const UPDATE_TIMEOUT = 86400000;

const exchangeRatesSlice = createSlice({
    name: 'exchangeRates',
    initialState: {
        lastUpdated: 0,
        rates: {},
        isFetching: false,
        didInvalidate: false
    } as ExchangeRates,
    reducers: {
        requestRates(state, action) {

        },

        reciveRates(state, action) {

        },


    }
});

const { actions, reducer } = exchangeRatesSlice;

export const {requestRates, reciveRates} = actions;

export const exchangeRatesReducer = reducer;


export const fetchExchangeRates =
    (): ThunkAction<void, RootState, null, Action<string>> =>
        async (dispatch, getState) => {
            const currentDate = Date.now();
            if (currentDate - getState().exchangeRates.lastUpdated > UPDATE_TIMEOUT) {
                dispatch(requestRates({}));
                //await api then catch
            }
        };