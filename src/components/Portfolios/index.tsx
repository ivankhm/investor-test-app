import React, { FC, useEffect } from 'react'
import { Tabs, Tab, Paper, Grid } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import CreatePorfolioForm from './CreatePorfolioForm';
import { RootState } from '../../store';
import { selectCurrentPortfolio } from '../../store/Portfolios';
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
        console.log('isFetching global: ', isFetching);

        dispatch(fetchExchangeRates());
    }, []);

    return (


        <Grid
            container
            direction="column"
            justify="center"
            alignItems="stretch"
            spacing={2}
        >

            <Grid item>
                <CreatePorfolioForm />
            </Grid>

            <Grid item>
                <Paper style={{ minHeight: '50vh' }} elevation={1}>
                    {list.length === 0 ? (

                        <Alert>
                            <AlertTitle>Вы еще не создали ни одного портфеля :(</AlertTitle>
                            Создайте новый прямо сейчас!
                        </Alert>

                    ) : (
                            <>
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
                                <AddStockItemForm />
                                <SelectedPortfolio />
                            </>
                        )}
                </Paper>
            </Grid>
        </Grid>
    )
}

export default Portfolios