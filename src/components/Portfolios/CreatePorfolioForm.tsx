import React, { FC, useState } from 'react'
import { Paper, Grid, TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

import { createPortfolio } from '../../store/Portfolios'
import useIsFetchingGlobal from '../../hooks/useIsFetchingGlobal';


const CreatePorfolioForm: FC = () => {
    const [portfolioName, setPortfolioName] = useState('');
    const isFetchingGlobal = useIsFetchingGlobal();

    const dispatch: AppDispatch = useDispatch();

    function onSumbmit() {
        if (portfolioName) {
            dispatch(createPortfolio(portfolioName));
            setPortfolioName('');
        }
    }

    return (
        <Paper>
            <Grid
                container
                justify="flex-start"
                alignItems="center"
                spacing={2}
            >
                <Grid style={{ marginLeft: 8 }} item>
                    <TextField
                        style={{ width: 300 }}
                        size="small"
                        label="Название нового портфеля"
                        variant="outlined"
                        required
                        value={portfolioName}
                        onChange={e => setPortfolioName(e.target.value)}
                    />

                </Grid>
                <Grid item>
                    <Button disabled={isFetchingGlobal} onClick={onSumbmit} variant="contained" size="medium" color="primary">Создать</Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default CreatePorfolioForm
