import { useSelector } from "react-redux";
import { RootState } from '../store'
import { RatesMapping } from "../api/CBR/types";

export function useIsFetchingGlobal() {
    return useSelector(({ portfolios }: RootState) => portfolios.isFetching);
}

export function useRates() {
    return useSelector(({ exchangeRates }: RootState): RatesMapping => exchangeRates.rates);
}