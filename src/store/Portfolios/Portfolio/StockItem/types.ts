export interface StockItem {
    name: string,
    symbol: string,

    amount: number,

    currentPrice: number,
    marketValue: number,

    deltaP: string, //процент изменения в виде строки ы
    currency: 'usd' | 'rub', //а надо ли?

    isFetching: boolean,
    didInvalidate: boolean 
    //возможно лучше на что-то поменять, но Date сохранить нельзя вродь
}

