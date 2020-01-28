// api ref: https://www.alphavantage.co/documentation/
import axios from 'axios'
import { ApiParams, GlobalQuoteParams, RawStockItem, SymbolSearchParams, RawSearchResult } from './types';

export module AlphaAdvantageApi {
    const config = {
        apiKey: '39LS35EIWF828AET',
        apiRoot: 'https://www.alphavantage.co/query'
    }
    
    function executeFuntion<T>(params: ApiParams) {
        //хз
        params.apiKey = config.apiKey;
        return axios.get<T>(config.apiRoot, { params } );
    }
    
    export function getQuoteEndpoint(symbol: String) {
        let params = {
            function: 'GLOBAL_QUOTE',
            symbol
        } as GlobalQuoteParams;
    
        return executeFuntion<RawStockItem>(params);
    }
    
    export function getSymbolSearch(keywords: String) {
        let params = {
            function: 'SYMBOL_SEARCH',
            keywords
        } as SymbolSearchParams;
    
        return executeFuntion<RawSearchResult>(params);
    }
}
