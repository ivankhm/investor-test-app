import React, { FC, Fragment } from 'react'
import { Tabs, Tab, Paper, AppBar, Box, TextField, Button, Grid, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useSelector, useDispatch } from 'react-redux'
import CreatePorfolioForm from './CreatePorfolioForm';
import { RootState } from '../../store';
import { selectCurrentPortfolio } from '../../store/Portfolios';
import AddStockItemForm from './AddStockItemForm';
import SelectedPortfolio from './SelectedPortfolio';
import { Alert, AlertTitle } from '@material-ui/lab';

const Portfolios: FC = () => {
    const { list, currentPortfolioId } = useSelector((state: RootState) => state.portfolios);
    const dispatch = useDispatch();

    const handleSelectPortfolio = (event: React.ChangeEvent<{}>, newValue: string) => {
        dispatch(selectCurrentPortfolio(newValue));
    };

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
                {list.length == 0 ? (
                    <Paper>
                        <Alert>
                            <AlertTitle>Вы еще не создали ни одного портфеля :(</AlertTitle>
                            Создайте новый прямо сейчас!
                        </Alert>
                    </Paper>
                ) : (
                        <Paper style={{ minHeight: '50vh' }} elevation={1}>
                            <Paper elevation={10}>
                                <Tabs
                                    value={currentPortfolioId}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={handleSelectPortfolio}
                                >
                                    {list.map(l => <Tab key={l.id} label={l.name} value={l.id} />)}
                                </Tabs>
                            </Paper>
                            <AddStockItemForm />
                            <SelectedPortfolio />
                        </Paper>

                    )}
            </Grid>
        </Grid>
    )
}

export default Portfolios