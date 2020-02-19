import React from 'react'
import { CircularProgress, Grid, makeStyles, Theme, createStyles, Paper } from '@material-ui/core'

import ErrorMessage from './ErrorMessage'

import DataBlock from '../DataBlock';
import usePortfolio from '../../../hooks/usePortfolio';
import StockItemsList from './StockItemsList'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        element: {
            padding: theme.spacing(2)
        },
    }),
);

const SelectedPortfolio: React.FC = () => {
    const classes = useStyles();
    const { portfolio } = usePortfolio();
    
    return (
        <Grid container justify="space-evenly" alignItems="center" spacing={2}>
            <Grid item xs={12}>
                <ErrorMessage className={classes.element} errorMessage={portfolio.apiLastError} />
            </Grid>

            <Grid item xs={12} sm={6}>
                <Paper className={classes.element}>
                    <DataBlock color={(!portfolio.didInvalidate && !portfolio.isFetching) ? 'error' : 'initial'} title='Рыночная стоимость портфеля' >
                        {portfolio.isFetching ? <CircularProgress size={24} /> : portfolio.marketValue} RUB
                    </DataBlock>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
                <Paper className={classes.element}>
                    <DataBlock title='Процент изменения'>
                        {portfolio.deltaP} %
                    </DataBlock>
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <StockItemsList className={classes.element} items={portfolio.savedItems} />
            </Grid>
        </Grid>
    )
}

export default SelectedPortfolio;

