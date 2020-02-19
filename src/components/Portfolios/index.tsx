import React, { FC, useEffect } from 'react'
import { Tabs, Tab, Paper, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import CreatePorfolioForm from './CreatePorfolioForm';
import { RootState } from '../../store';
import { selectCurrentPortfolio, abortUpdatig } from '../../store/Portfolios';
import AddStockItemForm from './AddStockItemForm';
import SelectedPortfolio from './SelectedPortfolio';
import { Alert, AlertTitle } from '@material-ui/lab';
import { fetchExchangeRates } from '../../store/ExchangeRates';

const Portfolios: FC = () => {
    const { list, currentPortfolioId, isFetching } = useSelector((state: RootState) => state.portfolios);
    const dispatch = useDispatch();

    const handleSelectPortfolio = (event: React.ChangeEvent<{}>, newValue: string) => {
        console.log('меняю портфель: ', isFetching);
        if (!isFetching && newValue !== currentPortfolioId) {
            dispatch(selectCurrentPortfolio(newValue));
        }
    };

    useEffect(() => {
        dispatch(fetchExchangeRates());
    }, [dispatch]);

    return (
        <Grid
            container
            direction="column"
            justify="center"
            spacing={2}
        >
            <Grid item>
                <CreatePorfolioForm />
            </Grid>
            {list.length === 0 ? (
                <Grid item>
                    <Alert>
                        <AlertTitle>Вы еще не создали ни одного портфеля :(</AlertTitle>
                        Создайте новый прямо сейчас!
                        </Alert>
                </Grid>

            ) : (
                    <>
                        <Grid item>
                            <Paper elevation={10}>
                                <Tabs
                                    value={currentPortfolioId}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={handleSelectPortfolio}
                                >
                                    {list.map(l => <Tab disabled={isFetching} key={l.id} label={l.name} value={l.id} />)}
                                </Tabs>
                            </Paper>
                        </Grid>
                        <Grid item>
                            <AddStockItemForm />
                        </Grid>
                        <Grid item>
                            <SelectedPortfolio />
                        </Grid>
                    </>
                )}
        </Grid>
    )
}

export default Portfolios