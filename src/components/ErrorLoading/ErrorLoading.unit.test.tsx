import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorLoading from './ErrorLoading';

// Mock the image import
jest.mock('../../Images/circle-exclamation.svg', () => 'circle-exclamation.svg');

describe('ErrorLoading', () => {
    it('renders error message correctly', () => {
        const testMessage = 'Failed to load data';
        render(<ErrorLoading message={testMessage} />);
        
        expect(screen.getByText(testMessage)).toBeInTheDocument();
    });

    it('renders exclamation icon with correct alt text', () => {
        render(<ErrorLoading message="Test error" />);
        
        const icon = screen.getByAltText('Exclamation Icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('src', 'circle-exclamation.svg');
    });

    it('applies correct CSS classes', () => {
        render(<ErrorLoading message="Test error" />);
        
        expect(screen.getByTestId('loading-error')).toHaveClass('loading-error');
        expect(screen.getByAltText('Exclamation Icon')).toHaveClass('loading-error-img');
        expect(screen.getByText('Test error')).toHaveClass('loading-error-txt');
    });
});