import { IPortfolioState, IStockItem } from "../Portfolios/types";
import { initialState, initialPortfolio } from '../Portfolios';
import { mockItemOld } from "./StockItems";

export const mockPortfolioId = 'someId';

export const mockState = {
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

export const mockChangingSate = {
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

export const mockAlmostChangedState = {
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