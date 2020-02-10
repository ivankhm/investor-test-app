import { createSlice, PayloadAction, ThunkAction, Action } from "@reduxjs/toolkit"
import { ExchangeRates } from "./types";
import { RootState } from "..";
import { getExchangeRates } from "../../api/CBR";
import { RatesMapping } from "../../api/CBR/types";
import { beginFetching, endFetching } from '../Base/FetchingBase'

//день
const UPDATE_TIMEOUT = 86400000;

const exchangeRatesSlice = createSlice({
    name: 'exchangeRates',
    initialState: {
        lastUpdated: 0,
        rates: {},
        isFetching: false,
        didInvalidate: false,
        apiLastError: false
    } as ExchangeRates,
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

            state = endFetching(state);
        },
        reciveError(state, {payload: apiLastError}: PayloadAction<string | false>) {
            return endFetching(state, apiLastError); 
        }
    }
});

const { actions, reducer } = exchangeRatesSlice;

export const { reciveError, requestRates, reciveRates } = actions;

export const exchangeRatesReducer = reducer;


export const fetchExchangeRates =
    (): ThunkAction<void, RootState, null, Action<string>> =>
        async (dispatch, getState) => {
            const currentDate = Date.now();
            console.log('проверка даты, lastUpdated: ', getState().exchangeRates.lastUpdated);
            //
            if (currentDate - getState().exchangeRates.lastUpdated > UPDATE_TIMEOUT) {
                console.log('старье - обновляем')
                dispatch(requestRates());
                //await api then catch
                getExchangeRates()
                    .then(({ data }) => {
                        if (!data.Valute) {
                            throw data.toString();
                        }
                        dispatch(reciveRates(data.Valute));

                    })
                    .catch((error: string) => {
                        dispatch(reciveError(error))
                    })
            }
        };