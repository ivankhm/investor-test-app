import React from 'react';
import {render} from '@testing-library/react';
import Header from '../Header';


describe('<Header/>', () => {
    it('should render the title', () => {
        const mockTitle = 'Some Title';
        const header = render(<Header title={mockTitle}/>);
        const title = header.getByTestId('header-title').textContent;

        expect(header).toBeTruthy();
        expect(title).toEqual(mockTitle);
    });
})