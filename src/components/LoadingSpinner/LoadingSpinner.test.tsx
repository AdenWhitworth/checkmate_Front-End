import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
    it('renders the loading spinner', () => {
        render(<LoadingSpinner />);
        
        const loadingContainer = screen.getByTestId('loading-spinner');
        expect(loadingContainer).toBeInTheDocument();
        expect(loadingContainer).toHaveClass('loading-container');
    });

    it('contains a loader element', () => {
        render(<LoadingSpinner />);
        
        const loader = screen.getByTestId('loader');
        expect(loader).toBeInTheDocument();
    });
}); 