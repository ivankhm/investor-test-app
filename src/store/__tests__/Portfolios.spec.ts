import { initialState, selectCurrentPortfolio, portfoliosReducer, createPortfolio, initialPortfolio, saveStockItem, recieveStockItemUpdate, recieveStockItemError, requestPortfolioUpdate, receivePortfolioUpdate, receiveApiError, abortUpdatig, fetchCurrentPortfolio } from "../Portfolios";
import { IPortfolioState, IStockItem } from "../Portfolios/types";
import { mockRates } from "./ExchangeRates.spec";
import { RawStockItem } from "../../api/AlphaVantageApi/types";
import thunk, { ThunkDispatch } from "redux-thunk";
import { RootState } from "..";
import { AnyAction } from "redux";
import MockAdapter from "axios-mock-adapter";
import configureMockStore from 'redux-mock-store'
import axios from 'axios';
import { config as apiConfig } from "../../api/AlphaVantageApi";
import { initialState as mockRatesState } from '../ExchangeRates';

const mockPortfolioId = 'someId';

type DispatchExts = ThunkDispatch<RootState, void, AnyAction>;

//const mockAxios = new MockAdapter(axios);
const mockStore = configureMockStore<RootState, DispatchExts>([thunk]);

jest.mock('uuid/v4', () => {
    return jest.fn().mockImplementation(() => {
        return mockPortfolioId;
    });
});


describe('Portfolio reducer', () => {
    const initialStockItem: IStockItem = {
        name: 'none',
        symbol: 'none',

        amount: 2,

        currentPrice: 1.11,
        marketValue: 2.22,

        deltaP: '1.5000%', //процент изменения в виде строки ы
        currency: 'USD',

        isFetching: false,
        didInvalidate: true,
        apiLastError: false
    }

    const mockItemNew = {
        ...initialStockItem,
        name: 'New Item',
        symbol: 'NI'
    } as IStockItem;

    const mockItemOld = {
        ...initialStockItem,
        name: 'Old Item',
        symbol: 'OI',
        deltaP: '0.0000%'
    };
    const mockState = {
        ...initialState,
        currentPortfolioId: mockPortfolioId,
        list: [
            {
                ...initialPortfolio,
                id: mockPortfolioId,
                marketValue: 2.22,
                deltaP: 0,
                savedItems: [
                    mockItemOld
                ]
            } as IPortfolioState
        ]
    }

    const mockChangingSate = {
        ...mockState,
        isFetching: true,
        list: [
            {
                ...mockState.list[0],
                isFetching: true,
                didInvalidate: false,
                apiLastError: false,
                savedItems: [
                    {
                        ...mockState.list[0].savedItems[0],
                        isFetching: true,
                        didInvalidate: false,
                        apiLastError: false
                    }
                ]
            } as IPortfolioState
        ]
    }

    const mockAlmostChangedState = {
        ...mockChangingSate,
        list: [
            {
                ...mockChangingSate.list[0],
                savedItems: [
                    {
                        ...mockChangingSate.list[0].savedItems[0],
                        isFetching: false,
                        didInvalidate: true,
                        apiLastError: false,

                        currentPrice: 2.22,
                        marketValue: 4.44,
                        deltaP: '50.0000%'
                    } as IStockItem
                ]
            }
        ]
    }

    const mockRawStockItem: RawStockItem = {
        'Global Quote': {
            '02. open': 123,
            '03. high': 123,
            '04. low': 123,
            '06. volume': 123,
            '07. latest trading day': 'day',
            '08. previous close': 123,
            '09. change': 123,

            '01. symbol': 'OI',
            '05. price': 2.22, //meaningfull
            '10. change percent': '50.0000%' //meaningfull
        }
    };

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
    })

    // describe('async actions', () => {

    //     afterEach(() => {
    //         mockAxios.reset();
    //     })
    //     afterAll(() => {
    //         mockAxios.restore();
    //     })

    //     it('should fetchCurrentPortfolio', async () => {
    //         //apiConfig
    //         const mockUrl = `${apiConfig.apiRoot}`//?apiLey=${apiConfig.apikey}&symbol=OI&function=GLOBAL_QUOTE`;

    //         mockAxios
    //             .onGet(mockUrl)
    //             .replyOnce(200, mockRawStockItem);

    //         const expectedActions = [requestPortfolioUpdate(), recieveStockItemUpdate(mockRawStockItem), receivePortfolioUpdate(mockRates)];
    //         const store = mockStore({
    //             portfolios: mockState,
    //             exchangeRates: mockRatesState
    //         });

    //         return store.dispatch(fetchCurrentPortfolio()).then(() => {
    //             expect(store.getActions()).toEqual(expectedActions);
    //         })
    //     })
    // })
})