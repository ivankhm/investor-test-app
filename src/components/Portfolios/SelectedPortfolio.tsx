import React, { useState, useEffect } from 'react'
import { CircularProgress, Paper, Grid, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography, Collapse, IconButton } from '@material-ui/core'
import { AlertTitle, Alert } from '@material-ui/lab'
import CloseIcon from '@material-ui/icons/Close';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { IStockItem } from '../../store/Portfolios/Portfolio/types'
import { fetchCurrentPortfolio } from '../../store/Portfolios'

interface Props {

}

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const SelectedPortfolio: React.FC<Props> = () => {
    const portfolio = useSelector(({ portfolios }: RootState) => portfolios.list.find(v => v.id === portfolios.currentPortfolioId));
    const apiError = useSelector((state: RootState) => state.portfolios.apiError);
    const [openError, setOpenError] = React.useState(true);

    const [updateTimeout, setUpdateTimeout] = useState<number>(0);


    const dispatch = useDispatch();

    useEffect(() => {
        console.log('apiError: ', apiError);
        
        if (apiError === false) {
            setOpenError(true);
        } else {
            setOpenError(false);
        }
    }, [])

    useEffect(() => {
        console.log('isFetching: ', portfolio?.isFetching);
        console.log('timeout: ', updateTimeout);



        if (!portfolio?.isFetching && !updateTimeout) {
            setUpdateTimeout(
                window.setTimeout(() => {
                    console.log('setTimout');
                    dispatch(fetchCurrentPortfolio());
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
    }, [portfolio?.isFetching, updateTimeout])

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
                    Что-то пошло не так при работе с API, подробности:
                    {apiError as string}
                </Alert>
            </Collapse>

            <Typography variant='h6'>{portfolio?.marketValue} $$$</Typography>
            {portfolio?.isFetching && <CircularProgress size={24} />}

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
                                <TableCell component="th" scope="row">
                                    {row.symbol}
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.amount}</TableCell>
                                <TableCell align="right">{row.currentPrice} {row.currency} </TableCell>
                                <TableCell align="right">{row.marketValue} {row.currency}</TableCell>
                                <TableCell align="right">{row.deltaP}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default SelectedPortfolio

