import { initialState, requestRates, reciveRates, reciveError, fetchExchangeRates, exchangeRatesReducer } from '../ExchangeRates'

import { mockRates } from '../__models__/ExchangeRates';

import configureMockStore from 'redux-mock-store'
import thunk, { ThunkDispatch } from 'redux-thunk';

import { RootState } from '..';
import { AnyAction } from 'redux';
import { initialState as portfoliosInitialState } from '../Portfolios';
import { apiRoot } from '../../api/CBR';
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios';


type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;


const mockStore = configureMockStore<RootState, DispatchExts>([thunk]);



describe('ExchangeRates reducer', () => {

    const mockAxios = new MockAdapter(axios);

    afterAll(() => {
        mockAxios.restore();
    })

    it('should requestRates', () => {
        const state = {
            ...initialState,
            didInvalidate: true,
        };

        expect(exchangeRatesReducer(state, requestRates()))
            .toEqual({
                ...state,
                isFetching: true,
                didInvalidate: false,
                apiLastError: false
            })
    })

    it('should reciveRates', () => {
        const mokingDate = 123;
        jest
            .spyOn(global.Date, 'now')
            .mockImplementationOnce(() =>
                new Date(mokingDate).valueOf()
            );

        const state = {
            ...initialState,
            isFetching: true,
            didInvalidate: false,
            apiLastError: 'some Error',
        };

        expect(exchangeRatesReducer(state, reciveRates(mockRates)))
            .toEqual({
                ...state,
                rates: {
                    ...mockRates,
                    'RUB': {
                        ID: '1',
                        NumCode: '643', //или 643 не знаю
                        CharCode: 'RUB',
                        Nominal: 1,
                        Name: 'Российский рубль',
                        Value: 1,
                        Previous: 1
                    }
                },

                isFetching: false,
                didInvalidate: true,
                apiLastError: false,
                lastUpdated: new Date(mokingDate).valueOf()
            })
    })

    it('should reciveError', () => {
        const state = {
            ...initialState,
            isFetching: true,
            didInvalidate: false,
            someValue: 0,
        };
        const newError = 'newError';

        expect(exchangeRatesReducer(state, reciveError(newError)))
            .toEqual({
                ...state,
                isFetching: false,
                didInvalidate: false,
                apiLastError: newError
            })
    })

    describe('async actions', () => {

        it('should fetchExchangeRates success', async () => {

            mockAxios
                .onGet(apiRoot)
                .replyOnce(200, {
                    Date: '123',
                    PreviousDate: '123',
                    PreviousURL: '123',
                    Timestamp: '123',
                    Valute: mockRates
                })


            const expectedActions = [requestRates(), reciveRates(mockRates)];
            const store = mockStore({
                portfolios: portfoliosInitialState,
                exchangeRates: initialState
            });

            return store.dispatch(fetchExchangeRates()).then(() => {
                //console.log(mockAxios.history);

                expect(store.getActions()).toEqual(expectedActions);
            })
        })

        it('should fetchExchangeRates error Wrong Data', async () => {

            const data = {
                Date: '123',
                PreviousDate: '123',
                PreviousURL: '123',
                Timestamp: '123',
                Valute: null
            };
            mockAxios
                .onGet(apiRoot)
                .replyOnce(200, data);

            const errorMock = `Ожидалисть обменные курсы, получено: ${JSON.stringify(data)}`;
            //console.log(errorMock);

            const expectedActions = [requestRates(), reciveError(errorMock)];
            const store = mockStore({
                portfolios: portfoliosInitialState,
                exchangeRates: initialState
            });

            return store.dispatch(fetchExchangeRates()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            })
        })

        it('should fetchExchangeRates Network Error', async () => {

            mockAxios
                .onGet(apiRoot)
                .networkErrorOnce();

            const errorMock = Error('Network Error').toString();
            //console.log(errorMock);

            const expectedActions = [requestRates(), reciveError(errorMock)];
            const store = mockStore({
                portfolios: portfoliosInitialState,
                exchangeRates: initialState
            });

            return store.dispatch(fetchExchangeRates()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            })
        })
    })



})