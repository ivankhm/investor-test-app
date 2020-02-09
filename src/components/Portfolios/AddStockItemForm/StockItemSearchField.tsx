import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { RawSearchMatch, WarningResult, RawSearchResult } from '../../../api/AlphaVantageApi/types';
import { TextField, CircularProgress } from '@material-ui/core';
import { getSymbolSearch } from '../../../api/AlphaVantageApi';

interface IStockItemSearchFieldProps {
    value: RawSearchMatch | null,
    onChange: (event: any, newValue: RawSearchMatch | null) => void,
    disabled?: boolean
}

const StockItemSearchField: React.FunctionComponent<IStockItemSearchFieldProps> = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [searchMatches, setSearchMatches] = useState<RawSearchMatch[]>([]);
    const [loading, setLoading] = useState(false);

    const typingTimeout = useRef(0);

    useEffect(() => {
        if (inputValue === '') {
            setSearchMatches([]);
        } else {
            typingTimeout.current = window.setTimeout(
                async () => {
                    setLoading(true);
                    let { data } = await getSymbolSearch(inputValue);
                    if (!(data as WarningResult).Note) {
                        setSearchMatches((data as RawSearchResult).bestMatches || []);
                    }
                    setLoading(false);
                },
                1000
            );
        }

        return () => {
            clearTimeout(typingTimeout.current);
        };

    }, [inputValue]);

    return (
        <Autocomplete

            getOptionSelected={(option, value) => option["1. symbol"] === value["1. symbol"]}
            getOptionLabel={(o: RawSearchMatch) => `${o["1. symbol"]} | ${o["2. name"]}`}

            options={searchMatches}
            loading={loading}

            value={props.value}
            onChange={props.onChange}

            style={{ width: 300 }}
            disabled={props.disabled ?? false}
            renderInput={params => (
                <TextField {...params}
                    size="small"
                    label="Поиск" variant="outlined" fullWidth
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
    );
};

export default StockItemSearchField;
