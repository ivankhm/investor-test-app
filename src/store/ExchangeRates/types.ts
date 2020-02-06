import { RatesMapping } from "../../api/CBR/types";
import { IFetchingBase } from '../Base/FetchingBase'

export interface ExchangeRates extends IFetchingBase {
    lastUpdated: number,
    rates: RatesMapping,
};