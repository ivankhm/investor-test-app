import React, { FC, useState, useEffect } from 'react'
import { RawSearchMatch, RawStockItem, WarningResult, RawSearchResult } from '../../api/AlphaAdvantageApi/types';
import { Paper, Grid, TextField, Button, CircularProgress, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getSymbolSearch, getQuoteEndpoint } from '../../api/AlphaAdvantageApi';
import { useDispatch } from 'react-redux';
import { combineSearchAndItem } from '../../helpers/StoreTypeConverter';
import { saveStockItem } from '../../store/Portfolios';


const AddStockItemForm: FC = () => {
    const [typingTimeout, setTypingTimeout] = useState<number>(0);
    const [amount, setAmount] = useState(0)
    const [inputValue, setInputValue] = useState('');
    const [searchMatches, setSearchMatches] = useState<RawSearchMatch[]>([]);

    const [selectedValue, setSelectedValue] = useState<RawSearchMatch | null>(null);
    const [newStockItem, setNewStockItem] = useState<RawStockItem | null>(null);

    const [loading, setLoading] = useState(false);

    const getSelectedPrice = () => newStockItem?.["Global Quote"]?.["05. price"] || '0'

    const getStockItemInfo = async (symbol: string) => {
        let { data } = await getQuoteEndpoint(symbol);
        setNewStockItem(data as RawStockItem);
    }

    const [buttonLoading, setButtonLoading] = useState(false);

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        setButtonLoading(true);

        const stockItem = combineSearchAndItem(selectedValue!, newStockItem!, amount);

        dispatch(saveStockItem(stockItem));

        setButtonLoading(false);
    }

    useEffect(() => {
        let active = true;

        if (inputValue === '') {
            setSearchMatches([]);
            return undefined;
        }

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(window.setTimeout(
            async () => {
                setLoading(true);
                if (active) {
                    let { data } = await getSymbolSearch(inputValue);
                    
                    if (!(data as WarningResult).Note) {
                        setSearchMatches((data as RawSearchResult).bestMatches || []);
                    }

                    
                }

                setLoading(false);
            },
            500
        ));

        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
            active = false;
        };

    }, [inputValue]);

    useEffect(() => {

        let symbol = selectedValue?.["1. symbol"];

        if (!!symbol) {
            getStockItemInfo(symbol!);
        }

    }, [selectedValue])

    return (
        <Paper>
            {selectedValue?.["1. symbol"]}
            <Grid
                container
                justify="flex-start"
                alignItems="center"
                spacing={2}
                style={{ margin: 4 }}
            >
                <Grid item>
                    <Autocomplete

                        getOptionSelected={(option, value) => option["1. symbol"] === value["1. symbol"]}
                        getOptionLabel={(o: RawSearchMatch) => `${o["1. symbol"]} | ${o["2. name"]}`}

                        options={searchMatches}
                        loading={loading}

                        value={selectedValue}
                        onChange={
                            (event: any, newValue: RawSearchMatch | null) => {
                                setSelectedValue(newValue);
                            }
                        }
                        style={{ width: 300 }}
                        disabled={buttonLoading}
                        renderInput={params => (
                            <TextField {...params}
                                size="small"
                                label="Добавить по названию" variant="outlined" fullWidth
                                onChange={e => setInputValue(e.target.value)}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    )
                                }}

                            />
                        )}
                    />
                </Grid>
                <Grid item>
                    <TextField
                        style={{ width: 300 }}
                        size="small"
                        label="Колличество"
                        type="number"
                        variant="outlined"
                        required
                        value={amount}
                        disabled={buttonLoading}
                        onChange={e => setAmount(Number(e.target.value))}
                    />

                </Grid>
                <Grid item>
                    <Typography variant='h6'>
                        Стоимость одной акции: {getSelectedPrice()} {selectedValue?.["8. currency"]} |
                        Общая стоимость: {amount * Number(getSelectedPrice())} {selectedValue?.["8. currency"]}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button onClick={_ => handleSubmit()} disabled={!selectedValue || amount <= 0 || buttonLoading} variant="contained" size="medium" color="primary">
                        Добавить в портфель
                        {buttonLoading && <CircularProgress size={24} />}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default AddStockItemForm
