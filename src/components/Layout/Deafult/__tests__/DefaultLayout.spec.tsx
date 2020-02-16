import React from 'react';
import { render } from '@testing-library/react';
import LayoutDefault from '..';


describe('Layout <Default/>', () => {
    it('should render the children', () => {
        const mockChildren = 'Some Children';
        const layout = render(<LayoutDefault>{mockChildren}</LayoutDefault>);
        const children = layout.getByTestId('children-container').textContent;
        
        expect(layout).toBeTruthy();
        expect(children).toEqual(mockChildren);
    });
})