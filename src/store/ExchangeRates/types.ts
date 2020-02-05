import { RatesMapping } from "../../api/CBR/types";


export interface ExchangeRates {
    lastUpdated: number,
    rates: RatesMapping, 
    isFetching: boolean, 
    didInvalidate: boolean,
    apiError: string | false
};