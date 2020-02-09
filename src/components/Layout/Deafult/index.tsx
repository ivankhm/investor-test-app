import React, { ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'
import { CssBaseline, Container } from '@material-ui/core'

import { createMuiTheme, ThemeProvider, makeStyles } from "@material-ui/core/styles";
import { ruRU } from '@material-ui/core/locale';

//локализация
const theme = createMuiTheme({}, ruRU);

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2)
    }, 
    footer: {
        padding: theme.spacing(3, 2),
        marginTop: 'auto',
        backgroundColor:
          theme.palette.type === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
      }
}));

interface ILayoutDefaultProps {
    children: ReactNode
}

export default function LayoutDefault(props: ILayoutDefaultProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Header title="Виртуальный инвестор" />
                <Container className={classes.main} maxWidth="md" >

                    {props.children}

                </Container>
                <Footer classes={classes.footer}/>
            </ThemeProvider >
        </div>

    )

}
