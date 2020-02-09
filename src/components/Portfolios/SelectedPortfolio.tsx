import React, { useState, useEffect } from 'react'
import { CircularProgress, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Collapse, Grid } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import { IStockItem } from '../../store/Portfolios/types'

import ErrorMessage from './ErrorMessage'

import DataBlock from './DataBlock';
import usePortfolio from '../../hooks/usePortfolio';


const SelectedPortfolio: React.FC = () => {

    const { portfolio } = usePortfolio();
    const [openError, setOpenError] = useState(false);

    useEffect(() => {
        console.log('apiError: ', portfolio.apiLastError);

        if (portfolio.apiLastError === false) {
            setOpenError(false);
        } else {
            setOpenError(true);
        }
    }, [portfolio.apiLastError, portfolio])

    return (
        <div>
            <Collapse in={openError}>
                <ErrorMessage message={portfolio!.apiLastError as string} onClose={()=>setOpenError(false)} />
            </Collapse>
            <Grid
                container
                direction="row"
                justify="space-evenly"
                alignItems="stretch"
                spacing={2}
            >
                <Grid item>
                    <DataBlock color={(!portfolio.didInvalidate && !portfolio.isFetching) ? 'error' : 'initial'} title='Рыночная стоимость портфеля' >
                        {portfolio.isFetching ? <CircularProgress size={24} /> : portfolio.marketValue} RUB
                    </DataBlock>
                </Grid>
                <Grid item>
                    <DataBlock title='Процент изменения'>
                        {portfolio.deltaP} %
                    </DataBlock>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table size="small" >
                    <TableHead>
                        <TableRow>
                            <TableCell>Символ</TableCell>
                            <TableCell align="right">Название</TableCell>
                            <TableCell align="right">Количество</TableCell>
                            <TableCell align="right">Цена одной акции</TableCell>
                            <TableCell align="right">Рыночная стоимость</TableCell>
                            <TableCell align="right">Индикатор изменения</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {portfolio.savedItems.map((row: IStockItem) => (
                            <TableRow selected={!row.didInvalidate && !row.isFetching} key={row.symbol}>
                                <TableCell component="th" scope="row">
                                    {row.symbol}
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                                {row.isFetching ? (
                                    <>

                                        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                                        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                                        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                                    </>

                                ) : (
                                        <>
                                            <TableCell align="right">{row.currentPrice} {row.currency} </TableCell>
                                            <TableCell align="right">{row.marketValue} {row.currency}</TableCell>
                                            <TableCell align="right">{row.deltaP}</TableCell>
                                        </>

                                    )}


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    )
}

export default SelectedPortfolio

