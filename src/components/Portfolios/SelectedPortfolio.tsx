import React, { useState, useEffect } from 'react'
import { CircularProgress, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Collapse, IconButton } from '@material-ui/core'
import { AlertTitle, Alert, Skeleton } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { IStockItem } from '../../store/Portfolios/Portfolio/types'
import { fetchCurrentPortfolio } from '../../store/Portfolios'



const SelectedPortfolio: React.FC = () => {
    const portfolio = useSelector(({ portfolios }: RootState) => portfolios.list.find(v => v.id === portfolios.currentPortfolioId));
    const apiError = useSelector((state: RootState) => state.portfolios.apiError);
    const [openError, setOpenError] = React.useState(false);

    const [updateTimeout, setUpdateTimeout] = useState<number>(0);


    const dispatch = useDispatch();

    useEffect(() => {
        console.log('apiError: ', apiError);

        if (apiError == false) {
            setOpenError(false);
        } else {
            setOpenError(true);
        }
    }, [apiError])

    useEffect(() => {
        console.log('isFetching: ', portfolio?.isFetching);
        console.log('timeout: ', updateTimeout);

        if (!portfolio?.isFetching && !updateTimeout && portfolio?.savedItems.length !== 0) {
            setUpdateTimeout(
                window.setTimeout(() => {
                    console.log('setTimout');
                    dispatch(fetchCurrentPortfolio());

                    clearTimeout(updateTimeout);
                    setUpdateTimeout(0);
                }, 10000)
            )

        }
        return () => {
            if (updateTimeout) {
                console.log('clearing');

                clearTimeout(updateTimeout);
                setUpdateTimeout(0);
            }

        }
    }, [portfolio?.isFetching, updateTimeout, portfolio?.savedItems])

    return (
        <div>
            <Collapse in={openError}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpenError(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    <AlertTitle>Ошибочка!</AlertTitle>
                    <p>Что-то пошло не так при работе с API, подробности:</p>
                    <p>
                        <strong>{apiError as string}</strong>
                    </p>
                </Alert>
            </Collapse>

            <Typography variant='h6'>{portfolio?.marketValue} $$$ | {portfolio?.isFetching && <CircularProgress size={24} />} </Typography>
            <Typography variant='h6'>Процент изменения {portfolio?.deltaP} % </Typography>

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
                        {portfolio?.savedItems.map((row: IStockItem) => (
                            <TableRow key={row.symbol}>
                                {row.isFetching ? (
                                    <React.Fragment>
                                        <TableCell component="th" scope="row">
                                            {row.symbol}
                                        </TableCell>
                                        <TableCell align="right">{row.name}</TableCell>
                                        <TableCell align="right">{row.amount}</TableCell>
                                        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                                        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                                        <TableCell align="right"><Skeleton animation="wave" /></TableCell>
                                    </React.Fragment>
                                    
                                ) : (
                                        <React.Fragment>
                                            <TableCell component="th" scope="row">
                                                {row.symbol}
                                            </TableCell>
                                            <TableCell align="right">{row.name}</TableCell>
                                            <TableCell align="right">{row.amount}</TableCell>
                                            <TableCell align="right">{row.currentPrice} {row.currency} </TableCell>
                                            <TableCell align="right">{row.marketValue} {row.currency}</TableCell>
                                            <TableCell align="right">{row.deltaP}</TableCell>
                                        </React.Fragment>

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

