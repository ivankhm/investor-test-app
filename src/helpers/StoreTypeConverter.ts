import { RawStockItem, RawSearchMatch } from "../api/AlphaAdvantageApi/types";
import { IStockItem, Currrency } from "../store/Portfolios/types";

export function updateStockItemFromRaw(item: IStockItem, {'Global Quote': raw}: RawStockItem): IStockItem {

    //ОБНОВИТЬ ТО ТОЛЬКО НАДО ЦЕНУ И ПРОЦЕНТ
    //была идея хранить в рублях, но это не так нужно, ведь нам нужно переводить валюты только при сумме
    let result: IStockItem = {
        ...item,
        currentPrice: raw["05. price"],
        deltaP: raw["10. change percent"]
    };

    result.marketValue = result.amount * result.currentPrice;

    return result;
}

export function combineSearchAndItem(searchMarch: RawSearchMatch, {'Global Quote': item}: RawStockItem, amount: number): IStockItem {
    const stockItemPrice = item["05. price"]
    const stockItem: IStockItem = {
        name: searchMarch["2. name"],
        symbol: searchMarch["1. symbol"],
        
        amount: amount,

        currentPrice: stockItemPrice,
        marketValue: stockItemPrice * amount,

        deltaP: item["10. change percent"], //процент изменения в виде строки ы
        currency: searchMarch["8. currency"].toUpperCase() as Currrency, 

        isFetching: false
    }

    return stockItem;
}

//todo:  конвертер из сырого в нет или не надо хз