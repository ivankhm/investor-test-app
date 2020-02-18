import React, { ReactNode } from 'react';

import AddStockItemForm from '..';
import { RootState } from '../../../../store';
import { mockState as mockPortfoliosState } from '../../../../store/__models__/Portfolios';
import { mockRates } from '../../../../store/__models__/ExchangeRates';
import { initialState as initialRates } from '../../../../store/ExchangeRates';
import { AnyAction } from 'redux';
import { mount } from 'enzyme';
import StockItemSearchField from '../StockItemSearchField';
import { mockSearchMatch } from '../__models__/ItemsSearch';
import MockAdapter from 'axios-mock-adapter';
import { GlobalQuoteParams } from '../../../../api/AlphaVantageApi/types';
import axios from 'axios';
import { config as apiConfig } from "../../../../api/AlphaVantageApi";
import { mockRawStockItem } from '../../../../store/__models__/StockItems';
import { Button, Collapse, CircularProgress } from '@material-ui/core';
import DataBlock from '../../DataBlock';
import { act } from '@testing-library/react';
import { combineSearchAndItem } from '../../../../helpers/StoreTypeConverter';
import { saveStockItem } from '../../../../store/Portfolios';

const mockRatesState = {
    ...initialRates,
    rates: mockRates
}

const mockRootState: RootState = {
    portfolios: mockPortfoliosState,
    exchangeRates: mockRatesState
}

type Selector = (state: RootState) => any;

const mockDispatch = jest.fn().mockImplementation((action: AnyAction) => {
    console.log('dispatched: ', action);
    return action;
})

jest.mock('react-redux', () => {
    return {
        useDispatch: () => (action: AnyAction) => mockDispatch(action),
        useSelector: (selector: Selector) => selector(mockRootState)
    }
})

const original = console.error

beforeAll(() => {
    console.error = jest.fn()
})

afterAll(() => {
    console.error = original
})

describe('<AddStockItemForm />', () => {

    let mockAxios: MockAdapter;

    const config = {
        params: {
            function: 'GLOBAL_QUOTE',
            symbol: 'OI',
            apikey: apiConfig.apikey
        } as GlobalQuoteParams
    }

    const container = mount(<AddStockItemForm />);
    let priceDataBlock = container.find("DataBlock[title='Стоимость одной акции']");
    let buttonSubmit = container.find(Collapse).find(Button);

    beforeEach(() => {
        mockAxios = new MockAdapter(axios);
    })

    afterEach(() => {
        mockAxios.reset();
    })

    it('should render', () => {
        expect(container).toBeTruthy();
    })

    it('should update selected item', async () => {
        mockAxios
            .onGet(apiConfig.apiRoot, config)
            .replyOnce(200, mockRawStockItem);

        const autocomplete = container.find(StockItemSearchField);


        expect(buttonSubmit.prop('disabled'))
            .toEqual(true);


        expect(priceDataBlock.prop('children'))
            .toEqual(['0', ' ', undefined]);


        await act(async () => {
            autocomplete.prop('onChange')({}, mockSearchMatch);
            await Promise.resolve(container.setProps({}));
        })

        priceDataBlock = container.find("DataBlock[title='Стоимость одной акции']")
        expect(priceDataBlock.prop('children'))
            .not.toEqual(['0', ' ', undefined]);

        await act(async () => {
            await Promise.resolve(container.setProps({}));
        })

        priceDataBlock = container.find("DataBlock[title='Стоимость одной акции']")
        console.log('act 2: ', priceDataBlock.prop('children'));
        expect(priceDataBlock.prop('children'))
            .toEqual([2.22, ' ', 'usd']);

        buttonSubmit = container.find(Collapse).find(Button);

        expect(buttonSubmit.prop('disabled'))
            .toEqual(false);

    });

    it('should handle submit click', async () => {
        await act(async () => {

            buttonSubmit.simulate('click');
            expect(mockDispatch).toBeCalledTimes(1);
            expect(mockDispatch).toBeCalledWith(saveStockItem({
                item: combineSearchAndItem(mockSearchMatch, mockRawStockItem, 1),
                rates: mockRates
            }))

            await Promise.resolve(container.setProps({}));

            buttonSubmit = container.find(Collapse).find(Button);

            expect(buttonSubmit.prop('disabled'))
                .toEqual(true);

            priceDataBlock = container.find("DataBlock[title='Стоимость одной акции']")
            expect(priceDataBlock.prop('children'))
                .toEqual(['0', ' ', undefined]);
        })
    });
})
