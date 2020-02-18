import React from 'react';
import { mount } from 'enzyme'

import StockItemSearchField from '../StockItemSearchField';
import { RawSearchMatch, SymbolSearchParams, SymbolSearchResult } from '../../../../api/AlphaVantageApi/types';
import { Autocomplete } from '@material-ui/lab';
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios';
import { config as apiConfig } from '../../../../api/AlphaVantageApi'
import { TextField } from '@material-ui/core';
import { mockSearchMatch, mockSearchResult } from '../__models__/ItemsSearch';

const original = console.error

beforeAll(() => {
    console.error = jest.fn()
})

afterAll(() => {
    console.error = original
})

describe('<StockItemSearchField />', () => {
    

    const props = {
        value: null,
        onChange: jest.fn()
    }

    describe('props', () => {

        const container = mount(<StockItemSearchField {...props} />);
        const autocomplete = container.find(Autocomplete);

        it('should render', () => {
            expect(container).toBeTruthy();
            expect(autocomplete.prop('value')).toEqual(props.value);
        })

        it('should change', () => {
            autocomplete.prop('onChange')({
                target: {
                    value: mockSearchMatch
                }
            });
            expect(props.onChange).toBeCalledTimes(1);
        });

        it('should be disabled', () => {
            const disabledContainer = mount(<StockItemSearchField {...props} disabled={true} />);
            expect(disabledContainer.find(Autocomplete).prop('disabled'))
                .toEqual(true);
        });
    });

    describe('useEffect', () => {
        let mockAxios: MockAdapter;

        beforeAll(() => {
            mockAxios = new MockAdapter(axios);
        })

        it('should fetch search query', async () => {

            const params: SymbolSearchParams = {
                keywords: 'OI',
                function: 'SYMBOL_SEARCH',
                apikey: apiConfig.apikey
            }
            
            const getResult = jest.fn().mockReturnValue(mockSearchResult)

            mockAxios
                .onGet(apiConfig.apiRoot, params)
                .replyOnce(() => {
                    const res = getResult();
                    return [200, res];
                })


            jest.useFakeTimers();

            const container = mount(<StockItemSearchField {...props} />)

            const textField = container.find(TextField);
            
            //ts ругается, но работает Оо
            textField.prop('onChange')!({
                target: {
                    name: 'TextInput',
                    value: 'OI',
                }
            })

            container.setProps({});
            jest.runAllTimers();

            return Promise.resolve(container)
                .then(() => {
                    expect(setTimeout).toHaveBeenCalledTimes(1);
                    expect(getResult).toHaveBeenCalledTimes(1);
                })

        });
    })
})
