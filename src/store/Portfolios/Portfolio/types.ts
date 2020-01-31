
export type Currrency = 'usd' | 'rub'

export interface IStockItem {
    name: string,
    symbol: string,

    amount: number,

    currentPrice: number,
    marketValue: number,

    deltaP: string, //процент изменения в виде строки ы
    currency: Currrency, //а надо ли?

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