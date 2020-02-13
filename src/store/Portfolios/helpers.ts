import { IPortfolioState, IStockItem } from "./types";
import { RatesMapping } from "../../api/CBR/types";

//Mutating portfolioState
export function updatePortfolioSumAndDelta(portfolioSate: IPortfolioState, rates: RatesMapping) {
    const newMarketValue = getPortolioSum(portfolioSate.savedItems, rates);
    
    portfolioSate.marketValue = newMarketValue;        
    portfolioSate.deltaP = getPortfolioDeltaP(newMarketValue, portfolioSate.savedItems, rates);
}

export function getPortolioSum(savedItems: IStockItem[], rates: RatesMapping): number {
    const result = savedItems
        .map(i => {
            const { Value, Nominal } = rates[i.currency];
            return Math.round(((i.marketValue * 100) * (Value * 100) / Nominal) / 100) / 100;
        }) //переводим в рубли
        .reduce((acc, cur) => ((acc * 100) + (cur * 100)) / 100); //просто счтитаем сумму
    //убираем знаки лишние
    return Math.round(result * 100) / 100;
}

export function getPortolioPrevSum(savedItems: IStockItem[], rates: RatesMapping) {
    return savedItems
        .map(i => {
            const { Value, Nominal } = rates[i.currency];

            //в рублях с двумя знаками после запятой ( * 100)
            const inRub = Math.round(((i.marketValue * 100) * (Value * 100) / Nominal) / 100);

            //процент изменения, с отброшенными знаками после запятой
            const deltaPx1000 = 100 - Math.round((parseFloat(i.deltaP) * 10000)) / 10000;

            //безопасное умножение, отбрасывание лишних знаков 
            return Math.round((inRub * (deltaPx1000 * 100)) / 10000) / 100
        })
        .reduce((acc, cur) => ((acc * 100) + (cur * 100)) / 100);
}

export function getPortfolioDeltaP(newMarketValue: number, savedItems: IStockItem[], rates: RatesMapping) {
    const oldMarketValue = getPortolioPrevSum(savedItems, rates);
            
    return Math.round(((newMarketValue - oldMarketValue) / newMarketValue) * 1000000) / 10000;         
}