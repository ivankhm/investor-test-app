import { StockItem } from "./StockItem/types";


export interface Portfolio {
    id: number,
    name: string,
    savedItems: StockItem[],
    marketValue: number,
    deltaP: number,

    lastUpdated: number,
    isFetching: boolean,
    didInvalidate: boolean
}