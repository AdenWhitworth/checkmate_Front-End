import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotOption from './BotOption';

describe('BotOption', () => {
    const defaultProps = {
        icon: '/test-icon.svg',
        label: 'Novice',
        range: '< 1000',
        isSelected: false,
        onClick: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders bot option with correct content', () => {
        render(<BotOption {...defaultProps} />);

        expect(screen.getByText('Novice')).toBeInTheDocument();
        expect(screen.getByText('< 1000')).toBeInTheDocument();
        expect(screen.getByAltText('Novice Icon')).toBeInTheDocument();
    });

    it('applies selected class when isSelected is true', () => {
        render(<BotOption {...defaultProps} isSelected={true} />);

        const botOption = screen.getByTestId('bot-option');
        expect(botOption).toHaveClass('bot-option', 'option-selected');
    });

    it('does not apply selected class when isSelected is false', () => {
        render(<BotOption {...defaultProps} isSelected={false} />);

        const botOption = screen.getByTestId('bot-option');
        expect(botOption).toHaveClass('bot-option');
        expect(botOption).not.toHaveClass('option-selected');
    });

    it('calls onClick handler when clicked', () => {
        render(<BotOption {...defaultProps} />);

        const botOption = screen.getByTestId('bot-option');
        fireEvent.click(botOption);
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('renders icon with correct src and alt text', () => {
        render(<BotOption {...defaultProps} />);

        const icon = screen.getByAltText('Novice Icon') as HTMLImageElement;
        expect(icon.src).toContain('/test-icon.svg');
    });

    it('renders with different difficulty level', () => {
        const props = {
            ...defaultProps,
            label: 'Master',
            range: '> 2000'
        };
        render(<BotOption {...props} />);

        expect(screen.getByText('Master')).toBeInTheDocument();
        expect(screen.getByText('> 2000')).toBeInTheDocument();
        expect(screen.getByAltText('Master Icon')).toBeInTheDocument();
    });
});