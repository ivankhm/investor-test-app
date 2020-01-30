import React, { FC } from 'react';
import LayoutDefault from './Layout/Deafult'
import Potfolios from './Portfolios'

import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import { store, persistor } from '../store';
import { LinearProgress } from '@material-ui/core';

const App: FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LinearProgress variant="query" />} persistor={persistor}>
        <LayoutDefault>
          <Potfolios />
        </LayoutDefault>
      </PersistGate>
    </Provider>
  );
}

export default App;
