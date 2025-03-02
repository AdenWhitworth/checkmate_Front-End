import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingDots from './LoadingDots';

describe('LoadingDots Component', () => {
    it('renders the loading dots with correct classes', () => {
        render(<LoadingDots position="center" color="grey" size="medium" />);
        
        const loadingDots = screen.getByTestId('loading-dots');
        expect(loadingDots).toBeInTheDocument();
        expect(loadingDots).toHaveClass('loading-dots position-center');
        
        const dots = screen.getAllByTestId('loading-dot');
        expect(dots.length).toBe(3);
    });

    it('applies the correct color and size classes', () => {
        render(<LoadingDots position="left" color="black" size="small" />);
        
        const loadingDots = screen.getByTestId('loading-dots');
        expect(loadingDots).toHaveClass('loading-dots position-left');
        
        const dots = screen.getAllByTestId('loading-dot');
        expect(dots[0]).toHaveClass('color-black size-small');
        expect(dots[1]).toHaveClass('color-black size-small');
        expect(dots[2]).toHaveClass('color-black size-small');
    });
}); 