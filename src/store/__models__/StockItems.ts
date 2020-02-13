import { IStockItem } from "../Portfolios/types";
import { RawStockItem } from "../../api/AlphaVantageApi/types";

export const initialStockItem: IStockItem = {
    name: 'none',
    symbol: 'none',

    amount: 2,

    currentPrice: 1.11,
    marketValue: 2.22,

    deltaP: '1.5000%', //процент изменения в виде строки ы
    currency: 'USD',

    isFetching: false,
    didInvalidate: true,
    apiLastError: false
}

export const mockItemNew = {
    ...initialStockItem,
    name: 'New Item',
    symbol: 'NI'
} as IStockItem;

export const mockItemOld = {
    ...initialStockItem,
    name: 'Old Item',
    symbol: 'OI',
    deltaP: '0.0000%'
};

export const mockRawStockItem: RawStockItem = {
    'Global Quote': {
        '02. open': 123,
        '03. high': 123,
        '04. low': 123,
        '06. volume': 123,
        '07. latest trading day': 'day',
        '08. previous close': 123,
        '09. change': 123,

        '01. symbol': 'OI',
        '05. price': 2.22, //meaningfull
        '10. change percent': '50.0000%' //meaningfull
    }
};