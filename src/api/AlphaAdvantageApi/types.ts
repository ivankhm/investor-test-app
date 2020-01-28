export type ApiFunction = 'GLOBAL_QUOTE' | 'SYMBOL_SEARCH';

export interface IApiParams {
    function: ApiFunction,
    apiKey: string
    //datatype?: 'json' | 'csv'
}

export interface GlobalQuoteParams extends IApiParams {
    symbol: string
}

export interface SymbolSearchParams extends IApiParams {
    keywords: string
}

export type ApiParams = GlobalQuoteParams | SymbolSearchParams;

export interface RawStockItem {
    'Global Quote': {
        '01. symbol': string,
        '02. open': number,
        '03. high': number,
        '04. low': number,
        '05. price': number,
        '06. volume': number,
        '07. latest trading day': string,
        '08. previous close': number,
        '09. change': number,
        '10. change percent': string
    }
}

//отдельное совпадение
export interface RawSearchMatch {
    '1. symbol': string,
    '2. name': string,
    '3. type': string,
    '4. region': string,
    '5. marketOpen': string,
    '6. marketClose': string,
    '7. timezone': string,
    '8. currency': string,
    '9. matchScore': number
}

//весь результат поиска
export interface RawSearchResult {
    bestMatches: RawSearchMatch[]
}