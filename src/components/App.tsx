import React, { FC, } from 'react';
import LayoutDefault from './Layout/Deafult'
import Potfolios from './Portfolios'

const App: FC = () => {
  return (
    <LayoutDefault>
      <Potfolios />
    </LayoutDefault>);
}

export default App;
