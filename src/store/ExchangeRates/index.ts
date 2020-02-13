import { createSlice, PayloadAction, } from "@reduxjs/toolkit"
import { ExchangeRates } from "./types";

import { getExchangeRates } from "../../api/CBR";
import { RatesMapping } from "../../api/CBR/types";
import { beginFetching, endFetching } from '../Base/FetchingBase'
import { AppThunk } from "../types";

//день
const UPDATE_TIMEOUT = 86400000;

export const initialState: ExchangeRates = {
    lastUpdated: 0,
    rates: {},
    isFetching: false,
    didInvalidate: false,
    apiLastError: false
};

const exchangeRatesSlice = createSlice({
    name: 'exchangeRates',
    initialState,
    reducers: {
        requestRates(state, action: PayloadAction<void>) {
            return beginFetching(state);
        },

        reciveRates(state, action: PayloadAction<RatesMapping>) {
            state.lastUpdated = Date.now();
            //заглушка, чтобы цены в рублях не пересчитывались
            state.rates =
            {
                ...action.payload,
                'RUB': {
                    ID: '1',
                    NumCode: '643', //или 643 не знаю
                    CharCode: 'RUB',
                    Nominal: 1,
                    Name: 'Российский рубль',
                    Value: 1,
                    Previous: 1
                }
            };

            endFetching(state);

        },
        reciveError(state, { payload: apiLastError }: PayloadAction<string | false>) {
            return endFetching(state, apiLastError);
        }
    }
});

const { actions, reducer } = exchangeRatesSlice;

export const { reciveError, requestRates, reciveRates } = actions;

export const exchangeRatesReducer = reducer;


export const fetchExchangeRates =
    (): AppThunk<Promise<void>> =>
        async (dispatch, getState) => {
            const currentDate = Date.now();
            
            if (currentDate - getState().exchangeRates.lastUpdated > UPDATE_TIMEOUT) {
                
                dispatch(requestRates());

                try {
                    const { data } = await getExchangeRates();

                    if (!data.Valute) {
                        throw `Ожидалисть обменные курсы, получено: ${JSON.stringify(data)}`;
                    }
                    
                    dispatch(reciveRates(data.Valute));
                } catch (error) {
                    
                    dispatch(reciveError(error.toString()))
                }
            }
        };