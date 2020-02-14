import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react'

import AddStockItemForm from '..';
import { RootState } from '../../../../store';
import { mockState as mockPortfoliosState } from '../../../../store/__models__/Portfolios';
import { mockRates } from '../../../../store/__models__/ExchangeRates';
import { initialState as initialRates } from '../../../../store/ExchangeRates';
import { AnyAction } from 'redux';

const mockRatesState = {
    ...initialRates,
    rates: mockRates
}

const mockRootState: RootState = {
    portfolios: mockPortfoliosState,
    exchangeRates: mockRatesState
}

type Selector = (state: RootState) => any;

jest.mock('react-redux', () => {

    return {
        useDispatch: () => (action: AnyAction) => { },
        useSelector: (selector: Selector)  => selector(mockRootState)
    }
})

describe('<AddStockItemForm />', () => {

    it('should render', () => {
        //https://github.com/testing-library/react-hooks-testing-library
        const addStockItemForm = render(<AddStockItemForm />);
        addStockItemForm.debug()


        expect(addStockItemForm).toBeTruthy();
    })
})
