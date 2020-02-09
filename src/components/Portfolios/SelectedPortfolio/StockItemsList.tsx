import * as React from 'react';
import { IStockItem } from '../../../store/Portfolios/types';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

interface IStockItemsListProps {
    items: IStockItem[],
    className?: string
}

const StockItemsList: React.FunctionComponent<IStockItemsListProps> = (props) => {

    return (
        <TableContainer className={props.className} component={Paper}>
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
                    {props.items.map((row: IStockItem) => (
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
    );
};

export default StockItemsList;
