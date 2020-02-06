import { IFetchingBase } from '../Base/FetchingBase'

export type Currrency = 'usd' | 'rub' | 'RUB' | 'AUD' | 'AZN' | 'GBP' | 'AMD' | 'BYN' | 'BGN' | 'BRL' | 'HUF' | 'HKD' | 'DKK' | 'USD' | 'EUR' | 'INR' | 'KZT' | 'CAD' | 'KGS' | 'CNY' | 'MDL' | 'NOK' | 'PLN' | 'RON' | 'XDR' | 'SGD' | 'TJS' | 'TRY' | 'TMT' | 'UZS' | 'UAH' | 'CZK' | 'SEK' | 'CHF' | 'ZAR' | 'KRW' | 'JPY';

export interface IStockItem extends IFetchingBase {
    name: string,
    symbol: string,

    amount: number,

    currentPrice: number,
    marketValue: number,

    deltaP: string, //процент изменения в виде строки ы
    currency: Currrency, //currentPrice и marketValue в этой валюте хранятся

    //возможно лучше на что-то поменять, но Date сохранить нельзя вродь
}

export interface IPortfolioState extends IFetchingBase {
    id: string,
    name: string,
    savedItems: IStockItem[],
    marketValue: number,
    deltaP: number,

}

export interface IPortfoliosState {
    currentPortfolioId: string,
    list: IPortfolioState[],

    //чтобы просто блокировать переключение
    isFetching: boolean
}