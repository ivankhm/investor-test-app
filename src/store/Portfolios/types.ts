export type Currrency = 'usd' | 'rub' | 'RUB' | 'AUD' |'AZN' |'GBP' |'AMD' |'BYN' |'BGN' |'BRL' |'HUF' |'HKD' |'DKK' |'USD' |'EUR' |'INR' |'KZT' |'CAD' |'KGS' |'CNY' |'MDL' |'NOK' |'PLN' |'RON' |'XDR' |'SGD' |'TJS' |'TRY' |'TMT' |'UZS' |'UAH' |'CZK' |'SEK' |'CHF' |'ZAR' |'KRW' |'JPY';

export interface IStockItem {
    name: string,
    symbol: string,

    amount: number,

    currentPrice: number,
    marketValue: number,

    deltaP: string, //процент изменения в виде строки ы
    currency: Currrency, //currentPrice и marketValue в этой валюте хранятся

    isFetching: boolean
    //возможно лучше на что-то поменять, но Date сохранить нельзя вродь
}



export interface IPortfolioState {
    id: string,
    name: string,
    savedItems: IStockItem[],
    marketValue: number,
    deltaP: number,

    lastUpdated: number,
    isFetching: boolean
}

export interface IPortfoliosState {
    currentPortfolioId: string,
    list: IPortfolioState[],
    
    isFetching: Boolean, 
    apiError: string | false
}