import { RawStockItem } from "../api/AlphaAdvantageApi/types";
import { StockItem } from "../store/Portfolios/Portfolio/types";

export function updateStockItemFromRaw(item: StockItem, {'Global Quote': raw}: RawStockItem): StockItem {

    //ОБНОВИТЬ ТО ТОЛЬКО НАДО ЦЕНУ И ПРОЦЕНТ
    let result: StockItem = {
        ...item,
        currentPrice: raw["05. price"],
        deltaP: raw["10. change percent"]
    };

    result.marketValue = result.amount * result.currentPrice;

    return result;
}

