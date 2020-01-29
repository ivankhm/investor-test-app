import { IPortfolioState } from "./Portfolio/types";

export interface Portfolios {
    selectedPortfolio: string,
    list: IPortfolioState[]
}