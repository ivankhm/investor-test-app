import React from 'react';

import { shallow } from 'enzyme';

import Header from '../Header';
import { Typography } from '@material-ui/core';


describe('<Header/>', () => {
    it('should render the title', () => {
        const mockTitle = 'Some Title';
        const header = shallow(<Header title={mockTitle} />);
        const title = header.find(Typography).prop('children')
        
        expect(header).toBeTruthy();
        expect(title).toEqual(mockTitle);
    });
})