import { IPortfolioState } from "./Portfolios/types";
import { ExchangeRates } from "./ExchangeRates/types";

export const migrations = {
    2: (state: any) => {
        console.log('Migrating 2!');

        return {
            ...state,
            portfolios: {
                ...state.portfolios,
                isFetching: false,
                apiError: false
            } as IPortfolioState
        }
    },
    3: (state: any) => {
        console.log('Migrating 3!');

        return {
            ...state,
            exchangeRates: {
                ...state.exchangeRates,
                isFetching: false,
                apiLastError: false,
                apiError: undefined,
            } as ExchangeRates
        }
    },
    4: (state: any) => {
        console.log('Migrating 4!');

        return {
            ...state,
            portfolios: {
                ...state.portfolios,
                apiError: undefined
            } as ExchangeRates
        }
    },
    5: (state: any) => {
        console.log('Migrating 4!');

        return {
            ...state,
            portfolios: {
                ...state.portfolios,
                list: state.portfolios.list
                    .map((p: any) => {
                        return {
                            ...p,
                            didInvalidate: true,
                            apiLastError: false,
                            apiError: undefined,
                            lastUpdated: undefined,
                            savedItems: p.savedItems.map((s: any) => {
                                return {
                                    ...s,
                                    didInvalidate: true,
                                    apiLastError: false,
                                }
                            })
                        }
                    })
            } as IPortfolioState
        }
    },
}