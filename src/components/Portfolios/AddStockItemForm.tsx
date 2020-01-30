import React, { useState, useMemo, useEffect } from 'react'
import { RawSearchMatch } from '../../api/AlphaAdvantageApi/types';
import { Paper, Grid, TextField, Button, CircularProgress, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getSymbolSearch } from '../../api/AlphaAdvantageApi';

interface Props {

}

const AddStockItemForm: React.FC<Props> = () => {

    const [typingTimeout, setTypingTimeout] = useState<number>(0);
    const [amount, setAmount] = useState(0)
    const [inputValue, setInputValue] = useState('');
    const [searchMatches, setSearchMatches] = useState<RawSearchMatch[]>([]);
    const [selectedValue, setSelectedValue] = useState<RawSearchMatch | null>(null);

    const [loading, setLoading] = useState(false);



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
                let { data } = await getSymbolSearch(inputValue);

                if (active) {
                    setSearchMatches(data.bestMatches || []);
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
                        id="combo-box-demo"

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
                        onChange={e => setAmount(Number(e.target.value))}
                    />

                </Grid>
                <Grid item>
                    <Typography variant='h6'>
                        Общая стоимость: {amount}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="medium" color="primary">Создать</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default AddStockItemForm
