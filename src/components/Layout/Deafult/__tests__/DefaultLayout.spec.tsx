import React from 'react';
import { render } from '@testing-library/react';
import LayoutDefault from '..';
import { shallow } from 'enzyme';
import { Container } from '@material-ui/core';


describe('<LayoutDefault/>', () => {
    it('should render the children', () => {
        const mockChildren = 'Some Children';
        const layout = shallow(<LayoutDefault>{mockChildren}</LayoutDefault>);
        const children = layout.find(Container).prop('children');
        
        
        expect(layout).toBeTruthy();
        expect(children).toEqual(mockChildren);

    });
})