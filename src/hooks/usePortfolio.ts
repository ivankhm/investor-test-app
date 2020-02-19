import { useEffect, useRef, useCallback } from "react";
import { fetchCurrentPortfolio, abortUpdatig } from "../store/Portfolios";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { useIsFetchingGlobal } from "./selectors";


export default function usePortfolio() {
    const portfolio = useSelector(({ portfolios }: RootState) => portfolios.list.find(v => v.id === portfolios.currentPortfolioId))!;
    const isFetchingGlobal = useIsFetchingGlobal();

    const dispatch = useDispatch();

    const updateTimout = useRef(0);

    const currentPortfolioId = portfolio.id;
    const numberOfItems = portfolio.savedItems.length

    //Основное выставление таймера с обновлением
    useEffect(() => {
        console.log('effect: ', updateTimout.current);
        if (!isFetchingGlobal && numberOfItems !== 0) {
            updateTimout.current = window.setTimeout(() => {
                dispatch(fetchCurrentPortfolio());
            }, 30000);
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

    //Отлавливает случаи закрытия страницы во время обновления
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