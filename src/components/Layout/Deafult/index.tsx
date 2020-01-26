import React, { Component, ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'
import { CssBaseline, Container } from '@material-ui/core'

import { createMuiTheme, ThemeProvider  } from "@material-ui/core/styles";
import { ruRU } from '@material-ui/core/locale';

const theme = createMuiTheme({}, ruRU);

interface Props {
    children: ReactNode
}

export default class LayoutDefault extends Component<Props> {
    render() {
        return (
            <div>
                <ThemeProvider theme={theme} >
                    <CssBaseline />
                    <Container maxWidth="md" >
                        <Header />
                        {this.props.children}
                        <Footer />
                    </Container>
                </ThemeProvider >

            </div>
        )
    }
}
