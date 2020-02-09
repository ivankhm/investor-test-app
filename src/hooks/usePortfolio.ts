import { useEffect, useRef } from "react";
import { fetchCurrentPortfolio, abortUpdatig } from "../store/Portfolios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import useIsFetchingGlobal from "./useIsFetchingGlobal";


export default function usePortfolio() {
    const portfolio = useSelector(({ portfolios }: RootState) => portfolios.list.find(v => v.id === portfolios.currentPortfolioId))!;
    const dispatch = useDispatch();
    const isFetchingGlobal = useIsFetchingGlobal();
    
    const updateTimout = useRef(0);

    useEffect(() => {
        console.log('effect: ', updateTimout.current);
        if (!isFetchingGlobal && portfolio!.savedItems.length !== 0) {
            updateTimout.current = window.setTimeout(() => {
                dispatch(fetchCurrentPortfolio());
            }, 10000);
            console.log('creating new timer: ', updateTimout.current);
        }

        return () => {
            console.log('clearing: ', updateTimout.current);
            window.clearTimeout(updateTimout.current);
        };
    }, [portfolio!.id, isFetchingGlobal, portfolio!.savedItems.length])

    useEffect(() => {
        console.log('SelectedPortfolio mount');

        if (portfolio!.isFetching) {
            dispatch(abortUpdatig());
        }

        return () => {
            console.log('SelectedPortfolio unmount');

            if (portfolio!.isFetching) {
                dispatch(abortUpdatig());
            }
        };
    }, [])

    return {
        portfolio
    }
};