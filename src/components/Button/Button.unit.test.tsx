import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
    const defaultProps = {
        children: 'Click Me',
        styleType: 'primary' as const,
        onClick: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders button with correct text', () => {
        render(<Button {...defaultProps} />);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('applies primary style class correctly', () => {
        render(<Button {...defaultProps} />);
        expect(screen.getByRole('button')).toHaveClass('button-primary');
    });

    it('applies secondary style class correctly', () => {
        render(<Button {...defaultProps} styleType="secondary" />);
        expect(screen.getByRole('button')).toHaveClass('button-secondary');
    });

    it('calls onClick handler when clicked', () => {
        render(<Button {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('applies additional className when provided', () => {
        render(<Button {...defaultProps} className="custom-class" />);
        expect(screen.getByRole('button')).toHaveClass('button-primary', 'custom-class');
    });

    it('disables button when disabled prop is true', () => {
        render(<Button {...defaultProps} disabled={true} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders with custom test ID when provided', () => {
        render(<Button {...defaultProps} testId="custom-button" />);
        expect(screen.getByTestId('custom-button')).toBeInTheDocument();
    });

    describe('with icon', () => {
        const iconProps = {
            ...defaultProps,
            imgSrc: '/test-icon.svg',
            imgAlt: 'Test Icon'
        };

        it('renders icon when imgSrc is provided', () => {
            render(<Button {...iconProps} />);
            const icon = screen.getByAltText('Test Icon') as HTMLImageElement;
            expect(icon).toBeInTheDocument();
            expect(icon.src).toContain('/test-icon.svg');
        });

        it('applies icon style class when icon is present', () => {
            render(<Button {...iconProps} />);
            expect(screen.getByRole('button')).toHaveClass('button-primary-icon');
        });

        it('applies icon class to image', () => {
            render(<Button {...iconProps} />);
            expect(screen.getByAltText('Test Icon')).toHaveClass('button-icon');
        });
    });

    it('sets button type attribute correctly', () => {
        render(<Button {...defaultProps} type="submit" />);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('defaults to button type when not specified', () => {
        render(<Button {...defaultProps} />);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('sets id attribute when provided', () => {
        render(<Button {...defaultProps} id="test-id" />);
        expect(screen.getByRole('button')).toHaveAttribute('id', 'test-id');
    });

    it('sets name attribute when provided', () => {
        render(<Button {...defaultProps} name="test-name" />);
        expect(screen.getByRole('button')).toHaveAttribute('name', 'test-name');
    });

    it('renders children as ReactNode', () => {
        render(
            <Button {...defaultProps}>
                <span data-testid="child-element">Complex Child</span>
            </Button>
        );
        expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
});