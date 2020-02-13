import { initialState, selectCurrentPortfolio, portfoliosReducer, createPortfolio, initialPortfolio, saveStockItem, recieveStockItemUpdate, recieveStockItemError, requestPortfolioUpdate, receivePortfolioUpdate, receiveApiError, abortUpdatig, fetchCurrentPortfolio } from "../Portfolios";
import { IPortfolioState, IStockItem } from "../Portfolios/types";
//import { mockRates } from "./ExchangeRates.spec";
import { RawStockItem, GlobalQuoteParams } from "../../api/AlphaVantageApi/types";
import thunk, { ThunkDispatch } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import MockAdapter from "axios-mock-adapter";
import configureMockStore from 'redux-mock-store'
import axios from 'axios';
import { config as apiConfig } from "../../api/AlphaVantageApi";
import { initialState as initialRates } from '../ExchangeRates';
import { RatesMapping } from "../../api/CBR/types";
import { mockRates } from '../__models__/ExchangeRates';
import { mockPortfolioId, mockState, mockChangingSate, mockAlmostChangedState } from "../__models__/Portfolios";
import { mockItemNew, mockItemOld, mockRawStockItem } from "../__models__/StockItems";


type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;

const mockStore = configureMockStore<RootState, DispatchExts>([thunk]);
const mockRatesState = {
    ...initialRates,
    rates: mockRates
}

jest.mock('uuid/v4', () => {
    return jest.fn().mockImplementation(() => {
        return mockPortfolioId;
    });
});


describe('Portfolio reducer', () => {

    it('should selectCurrentPortfolio', () => {
        expect(portfoliosReducer(initialState, selectCurrentPortfolio(mockPortfolioId)))
            .toEqual({
                ...initialState,
                currentPortfolioId: mockPortfolioId
            })
    })

    it('should createPortfolio', () => {
        const newName = 'someName';

        expect(portfoliosReducer(initialState, createPortfolio(newName)))
            .toEqual({
                ...initialState,
                currentPortfolioId: mockPortfolioId,
                list: [
                    ...initialState.list,
                    {
                        ...initialPortfolio,
                        id: mockPortfolioId,
                        name: newName,
                    }
                ]
            })
    })

    describe('StockItems actions', () => {

        it('should saveStockItem(new) and count changes', () => {
            expect(portfoliosReducer(mockState, saveStockItem({ item: mockItemNew, rates: mockRates })))
                .toEqual({
                    ...mockState,
                    list: [
                        {
                            ...initialPortfolio,
                            id: mockPortfolioId,
                            marketValue: 4.44,
                            deltaP: 0.6757,
                            savedItems: [
                                mockItemOld,
                                mockItemNew,
                            ]
                        }
                    ]
                })
        })

        it('should saveStockItem(existing), sum the amount and dont change percent', () => {
            expect(portfoliosReducer(mockState, saveStockItem({ item: mockItemOld, rates: mockRates })))
                .toEqual({
                    ...mockState,
                    list: [
                        {
                            ...initialPortfolio,
                            id: mockPortfolioId,
                            marketValue: 4.44,
                            deltaP: 0,
                            savedItems: [
                                {
                                    ...mockItemOld,
                                    amount: 4,
                                    marketValue: 4.44
                                }
                            ]
                        }
                    ]
                })
        })

        it('should recieveStockItemUpdate', () => {




            expect(portfoliosReducer(mockChangingSate, recieveStockItemUpdate(mockRawStockItem)))
                .toEqual({
                    ...mockChangingSate,
                    list: [
                        {
                            ...mockChangingSate.list[0],
                            marketValue: 2.22, //<-- Правильное поведение, т.к. сумма пересчитывается отдельно
                            deltaP: 0,
                            savedItems: [
                                {
                                    ...mockItemOld,
                                    currentPrice: 2.22,
                                    marketValue: 4.44,
                                    deltaP: '50.0000%',
                                    isFetching: false,
                                    didInvalidate: true,
                                    apiLastError: false
                                } as IStockItem
                            ]
                        }
                    ]
                })
        })

        it('should recieveStockItemError', () => {
            const mockNewError = 'someNewError';

            expect(portfoliosReducer(mockChangingSate, recieveStockItemError({ error: mockNewError, symbol: 'OI' })))
                .toEqual({
                    ...mockChangingSate,
                    list: [
                        {
                            ...mockChangingSate.list[0],
                            marketValue: 2.22, //<-- Правильное поведение, т.к. сумма пересчитывается отдельно
                            deltaP: 0,
                            savedItems: [
                                {
                                    ...mockItemOld,
                                    isFetching: false,
                                    didInvalidate: false,
                                    apiLastError: mockNewError
                                } as IStockItem
                            ]
                        }
                    ]
                })
        })
    })

    it('should requestPortfolioUpdate', () => {
        expect(portfoliosReducer(mockState, requestPortfolioUpdate()))
            .toEqual(mockChangingSate)
    })

    it('should receivePortfolioUpdate success', () => {

        expect(portfoliosReducer(mockAlmostChangedState, receivePortfolioUpdate(mockRates)))
            .toEqual({
                ...mockAlmostChangedState,
                isFetching: false,
                list: [
                    {
                        ...mockAlmostChangedState.list[0],
                        isFetching: false,
                        didInvalidate: true,
                        apiLastError: false,

                        marketValue: 4.44,
                        deltaP: 50
                    }
                ]
            })
    })

    it('should receivePortfolioUpdate error', () => {

        const mockAlmostChangedStateError = {
            ...mockAlmostChangedState,
            list: [
                {
                    ...mockAlmostChangedState.list[0],
                    apiLastError: 'someNewError',
                    marketValue: 1.11,
                    deltaP: 1
                }
            ]
        }

        expect(portfoliosReducer(mockAlmostChangedStateError, receivePortfolioUpdate(mockRates)))
            .toEqual({
                ...mockAlmostChangedStateError,
                isFetching: false,
                list: [
                    {
                        ...mockAlmostChangedStateError.list[0],
                        isFetching: false,
                        didInvalidate: false,
                    }
                ]
            })
    })

    it('should receiveApiError', () => {
        const mockNewError = 'someNewError';

        expect(portfoliosReducer(mockAlmostChangedState, receiveApiError(mockNewError)))
            .toEqual({
                ...mockAlmostChangedState,
                list: [
                    {
                        ...mockAlmostChangedState.list[0],
                        didInvalidate: false,
                        apiLastError: mockNewError
                    } as IPortfolioState
                ]
            })
    })

    it('should abortUpdatig', () => {
        const abortErrorMessage = 'Обновление было прервано';

        expect(portfoliosReducer(mockChangingSate, abortUpdatig()))
            .toEqual({
                ...mockChangingSate,
                isFetching: false,
                list: [
                    {
                        ...mockChangingSate.list[0],
                        isFetching: false,
                        didInvalidate: false,
                        apiLastError: abortErrorMessage,
                        savedItems: [
                            {
                                ...mockChangingSate.list[0].savedItems[0],
                                isFetching: false,
                                didInvalidate: false,
                                apiLastError: abortErrorMessage,
                            }
                        ]
                    }
                ]
            })
        const mockAxios = new MockAdapter(axios);
    })

    describe('async actions', () => {

        let mockAxios: MockAdapter;

        beforeAll(() => {
            mockAxios = new MockAdapter(axios);
        })


        it('should fetchCurrentPortfolio', async () => {
            //apiConfig
            //const mockUrl = `${}`;//?function=GLOBAL_QUOTE&symbol=OI&apiKey=${apiConfig.apikey}`;

            const config = {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: 'OI',
                    apikey: apiConfig.apikey
                } as GlobalQuoteParams
            }

            mockAxios
                .onGet(apiConfig.apiRoot, config)
                .replyOnce(200, mockRawStockItem);

            const expectedActions = [requestPortfolioUpdate(), recieveStockItemUpdate(mockRawStockItem), receivePortfolioUpdate(mockRates)];
            const store = mockStore({
                portfolios: mockState,
                exchangeRates: mockRatesState
            });

            return store.dispatch(fetchCurrentPortfolio()).then(() => {
                expect(store.getActions()).toEqual(expectedActions);
            })
        })
    })
})