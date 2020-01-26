import React, { FC, } from 'react';
import LayoutDefault from './Layout/Deafult'
import Potfolios from './Portfolios'

const App: FC = () => {
  return <div>
    <LayoutDefault>
      
      <Potfolios/>

    </LayoutDefault>
  </div>
    ;
}

export default App;
