import React, { FC, useState, useEffect } from 'react'
import { RawSearchMatch, RawStockItem } from '../../../api/AlphaAdvantageApi/types';
import { Paper, Grid, TextField, Button, CircularProgress, Collapse, IconButton, Typography } from '@material-ui/core';
import { getQuoteEndpoint } from '../../../api/AlphaAdvantageApi';
import { useDispatch } from 'react-redux';
import { combineSearchAndItem } from '../../../helpers/StoreTypeConverter';
import { saveStockItem } from '../../../store/Portfolios';
import StockItemSearchField from './StockItemSearchField';
import useIsFetchingGlobal from '../../../hooks/useIsFetchingGlobal';
import DataBlock from '../DataBlock';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

const AddStockItemForm: FC = () => {
    const isFetching = useIsFetchingGlobal();
    const [opened, setOpened] = useState(false);
    const [amount, setAmount] = useState(0);
    const [selectedValue, setSelectedValue] = useState<RawSearchMatch | null>(null);
    const [newStockItem, setNewStockItem] = useState<RawStockItem | null>(null);

    const getSelectedPrice = () => newStockItem?.["Global Quote"]?.["05. price"] || '0'
    const getStockItemInfo = async (symbol: string) => {
        let { data } = await getQuoteEndpoint(symbol);
        setNewStockItem(data as RawStockItem);
    }
    const dispatch = useDispatch();

    const cleanUp = () => {
        setSelectedValue(null);
        setNewStockItem(null);
        setAmount(0);
    }

    const handleSubmit = () => {
        const stockItem = combineSearchAndItem(selectedValue!, newStockItem!, amount);
        dispatch(saveStockItem(stockItem));
        cleanUp();
    }


    useEffect(() => {
        const symbol = selectedValue?.["1. symbol"];

        if (!!symbol) {
            getStockItemInfo(symbol!);
        }
    }, [selectedValue])

    const onSelectStockItem = (e: any, newValue: RawSearchMatch | null) => { setAmount(0); setSelectedValue(newValue); }

    return (
        <Paper>

            <Typography variant='subtitle1'>
                <IconButton onClick={() => setOpened(!opened)}>
                    {opened ?
                        <KeyboardArrowDownRoundedIcon fontSize="inherit" /> :
                        <KeyboardArrowRightRoundedIcon fontSize="inherit" />
                    }
                </IconButton>
                Добавить по названию
            </Typography>
            <Collapse in={opened}>
                <Grid
                    container
                    justify="flex-start"
                    alignItems="center"
                    spacing={2}
                    style={{ margin: 4 }}
                >
                    <Grid item xs={12} md={6}>
                        <StockItemSearchField value={selectedValue} onChange={onSelectStockItem} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            style={{ width: 300 }}
                            size="small"
                            label="Колличество"
                            type="number"
                            variant="outlined"
                            required
                            value={amount}
                            onChange={e => setAmount(Number(e.target.value))}
                        />

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DataBlock title='Стоимость одной акции'>
                            {getSelectedPrice()} {selectedValue?.["8. currency"]}
                        </DataBlock>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DataBlock title='Общая стоимость'>
                            {amount * Number(getSelectedPrice())} {selectedValue?.["8. currency"]}
                        </DataBlock>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button onClick={_ => handleSubmit()} disabled={!selectedValue || amount <= 0 || isFetching} variant="contained" size="medium" color="primary">
                            Добавить в портфель
                        </Button>
                    </Grid>
                </Grid>
            </Collapse>

        </Paper>
    )
}

export default AddStockItemForm
