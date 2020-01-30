import { IPortfolioState } from "./Portfolio/types";

export interface IPortfoliosState {
    currentPortfolioId: string,
    list: IPortfolioState[]
}