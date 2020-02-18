import React, { FC, useState, useEffect } from 'react'
import { RawSearchMatch, RawStockItem } from '../../../api/AlphaVantageApi/types';
import { Paper, Grid, TextField, Button, CircularProgress, Collapse } from '@material-ui/core';
import { getQuoteEndpoint } from '../../../api/AlphaVantageApi';
import { useDispatch } from 'react-redux';
import { combineSearchAndItem } from '../../../helpers/StoreTypeConverter';
import { saveStockItem } from '../../../store/Portfolios';
import StockItemSearchField from './StockItemSearchField';
import { useIsFetchingGlobal, useRates } from '../../../hooks/selectors';
import DataBlock from '../DataBlock';
import KeyboardArrowRightRoundedIcon from '@material-ui/icons/KeyboardArrowRightRounded';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

const toNumber = (value: string) => Number(value ?? '0');
const isUint = (value: string) => /^\d+$/.test(value);

const AddStockItemForm: FC = () => {
    const isFetching = useIsFetchingGlobal();
    const rates = useRates();

    const [opened, setOpened] = useState(false);
    const [amount, setAmount] = useState<string>('1');
    const [selectedValue, setSelectedValue] = useState<RawSearchMatch | null>(null);
    const [newStockItem, setNewStockItem] = useState<RawStockItem | null>(null);

    const [loadingItem, setLodingItem] = useState(false);

    const getSelectedPrice = () => newStockItem?.["Global Quote"]?.["05. price"] || '0'
    const getStockItemInfo = async (symbol: string) => {
        setLodingItem(true);
        const { data } = await getQuoteEndpoint(symbol);
        console.log('data: ', data);
        
        setNewStockItem(data as RawStockItem);
        setLodingItem(false);
    }
    const dispatch = useDispatch();

    const cleanUp = () => {
        setSelectedValue(null);
        setNewStockItem(null);
        setAmount('1');
    }

    const handleSubmit = () => {
        const stockItem = combineSearchAndItem(selectedValue!, newStockItem!, toNumber(amount));
        dispatch(saveStockItem({item: stockItem, rates}));
        cleanUp();
    }

    const onSelectStockItem = (e: any, newValue: RawSearchMatch | null) => { setAmount('1'); setSelectedValue(newValue); }

    const onAmountTyping = (e: React.KeyboardEvent<HTMLDivElement>) => {
        console.log('key: ', e.key);

        if (amount === '0' && isUint(e.key)) {
            setAmount('');
        }
    }

    useEffect(() => {
        const symbol = selectedValue?.["1. symbol"];

        if (!!symbol) {
            getStockItemInfo(symbol!);
        }
    }, [selectedValue])

    return (
        <Paper>
            <Button style={{ padding: 14 }} onClick={() => setOpened(!opened)}>
                {opened ?
                    <KeyboardArrowDownRoundedIcon fontSize="inherit" /> :
                    <KeyboardArrowRightRoundedIcon fontSize="inherit" />
                }
                Добавить по названию
            </Button>

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
                        <TextField size="small" label="Колличество" type="number" variant="outlined" required
                            style={{ width: 300 }}
                            value={amount}
                            error={!isUint(amount) || (toNumber(amount) <= 0)}
                            helperText='Введите целое положительное число'
                            onKeyDown={onAmountTyping}
                            onChange={e => setAmount(e.target.value)}
                        />

                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DataBlock title='Стоимость одной акции'>
                            {loadingItem ? <CircularProgress size={24} /> : getSelectedPrice()} {selectedValue?.["8. currency"]}
                        </DataBlock>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DataBlock title='Общая стоимость'>
                            {amount && Math.round((toNumber(amount) * 100) * (Number(getSelectedPrice()) * 100) / 100) / 100} {selectedValue?.["8. currency"]}
                        </DataBlock>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Button onClick={_ => handleSubmit()}
                            id='add-item-button'
                            disabled={!selectedValue || toNumber(amount) <= 0 || isFetching}
                            variant="contained" size="medium" color="primary">
                            Добавить в портфель
                        </Button>
                    </Grid>
                </Grid>
            </Collapse>
        </Paper>
    )
}

export default AddStockItemForm
