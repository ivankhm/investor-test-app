import { useEffect, useRef, useCallback } from "react";
import { fetchCurrentPortfolio, abortUpdatig } from "../store/Portfolios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import useIsFetchingGlobal from "./useIsFetchingGlobal";


export default function usePortfolio() {
    const portfolio = useSelector(({ portfolios }: RootState) => portfolios.list.find(v => v.id === portfolios.currentPortfolioId))!;

    const dispatch = useDispatch();
    const isFetchingGlobal = useIsFetchingGlobal();

    const updateTimout = useRef(0);

    const currentPortfolioId = portfolio.id;
    const numberOfItems = portfolio.savedItems.length

    useEffect(() => {
        console.log('effect: ', updateTimout.current);
        if (!isFetchingGlobal && numberOfItems !== 0) {
            updateTimout.current = window.setTimeout(() => {
                dispatch(fetchCurrentPortfolio());
            }, 15000);
            console.log('creating new timer: ', updateTimout.current);
        }
  
        return () => {
            console.log('clearing: ', updateTimout.current);
            window.clearTimeout(updateTimout.current);
        };
    }, [currentPortfolioId, isFetchingGlobal, numberOfItems, dispatch])



    const onClosePage = useCallback((ev: BeforeUnloadEvent) => {
        if (isFetchingGlobal) {
            dispatch(abortUpdatig());
        }
    }, [isFetchingGlobal, dispatch]);

    useEffect(() => {
        window.addEventListener("beforeunload", onClosePage);
        return () => {
            window.removeEventListener('beforeunload', onClosePage)
        };
    }, [dispatch, onClosePage])

    return {
        portfolio
    }
};