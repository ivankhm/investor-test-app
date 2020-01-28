import { Portfolio } from "./Portfolio/types";

export interface Portfolios {
    lastId: number, //свой AI?
    selectedPortfolio: number,
    list: Portfolio[]
}