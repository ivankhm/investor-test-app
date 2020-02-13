// api ref: https://www.alphavantage.co/documentation/
import axios from 'axios'
import { ApiParams, GlobalQuoteParams, SymbolSearchParams, SymbolSearchResult, GlobalQuoteResult } from './types';


export const config = {
    apikey: '39LS35EIWF828AET',
    apiRoot: 'https://www.alphavantage.co/query'
}

function executeFuntion<T>(params: ApiParams) {
    //хз
    params.apikey = config.apikey;
    return axios.get<T>(config.apiRoot, { params });
}

export function getQuoteEndpoint(symbol: string) {
    let params = {
        function: 'GLOBAL_QUOTE',
        symbol
    } as GlobalQuoteParams;

    return executeFuntion<GlobalQuoteResult>(params);
}

export function getSymbolSearch(keywords: string) {
    let params = {
        function: 'SYMBOL_SEARCH',
        keywords
    } as SymbolSearchParams;

    return executeFuntion<SymbolSearchResult>(params);
}

