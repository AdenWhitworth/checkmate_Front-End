import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {
    const defaultProps = {
        label: 'Test Label',
        name: 'test',
        type: 'text',
        isRequired: true,
        isSpellCheck: false,
        onChange: jest.fn(),
        'data-testid': 'test-input'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with required props', () => {
        render(<InputField {...defaultProps} />);
        
        expect(screen.getByTestId('test-input')).toBeInTheDocument();
        expect(screen.getByTestId('test-input-input-container')).toBeInTheDocument();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<InputField {...defaultProps} />);
        
        const input = screen.getByTestId('test-input');
        fireEvent.change(input, { target: { value: 'test value' } });
        
        expect(defaultProps.onChange).toHaveBeenCalled();
    });

    it('applies active class when input has value', () => {
        render(<InputField {...defaultProps} value="test value" />);
        
        const container = screen.getByTestId('test-input-input-container');
        expect(container).toHaveClass('active');
    });

    it('applies active class on focus', () => {
        render(<InputField {...defaultProps} />);
        
        const input = screen.getByTestId('test-input');
        fireEvent.focus(input);
        
        const container = screen.getByTestId('test-input-input-container');
        expect(container).toHaveClass('active');
    });

    it('maintains active class after blur if has value', () => {
        render(<InputField {...defaultProps} value="test value" />);
        
        const input = screen.getByTestId('test-input');
        fireEvent.blur(input);
        
        const container = screen.getByTestId('test-input-input-container');
        expect(container).toHaveClass('active');
    });

    it('removes active class on blur if empty', () => {
        render(<InputField {...defaultProps} value="" />);
        
        const input = screen.getByTestId('test-input');
        const container = screen.getByTestId('test-input-input-container');
        
        // Verify initial state
        expect(container).not.toHaveClass('active');
        
        // Focus
        fireEvent.focus(input);
        expect(container).toHaveClass('active');
        
        // Blur
        fireEvent.blur(input);
        expect(container).not.toHaveClass('active');
    });

    it('renders as disabled when isDisabled is true', () => {
        render(<InputField {...defaultProps} isDisabled={true} />);
        
        const input = screen.getByTestId('test-input');
        expect(input).toBeDisabled();
    });

    it('applies required attribute when isRequired is true', () => {
        render(<InputField {...defaultProps} />);
        
        const input = screen.getByTestId('test-input');
        expect(input).toBeRequired();
    });
});