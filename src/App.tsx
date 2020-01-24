import React, { FC } from 'react';
import { Container, CssBaseline } from '@material-ui/core/'

import { createMuiTheme, ThemeProvider  } from "@material-ui/core/styles";
import { ruRU } from '@material-ui/core/locale';

const theme = createMuiTheme({}, ruRU);

const App: FC = () => {
  return (<ThemeProvider theme={theme} >
    <CssBaseline />
    <Container fixed>
      <h1>Virtual Investor App</h1>
    </Container>
  </ThemeProvider >

  );
}

export default App;
