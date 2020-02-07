import { useSelector } from "react-redux";
import { RootState } from '../store'

export default function useIsFetchingGlobal() {
    return useSelector(({ portfolios }: RootState) => portfolios.isFetching);
}