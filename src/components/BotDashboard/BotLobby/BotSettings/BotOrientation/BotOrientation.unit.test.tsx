import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotOrientation from './BotOrientation';
import { useBot } from '../../../../../Providers/BotProvider/BotProvider';

jest.mock('../../../../../Providers/BotProvider/BotProvider');

describe('BotOrientation', () => {
    const mockSetOrientation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useBot as jest.Mock).mockReturnValue({
            setOrientation: mockSetOrientation
        });
    });

    it('renders orientation options with correct images and alt text', () => {
        render(<BotOrientation />);

        expect(screen.getByAltText('White King')).toBeInTheDocument();
        expect(screen.getByAltText('Black King')).toBeInTheDocument();
        expect(screen.getByAltText('Question mark')).toBeInTheDocument();
        expect(screen.getByText('Play as:')).toBeInTheDocument();
    });

    it('starts with white selected by default', () => {
        render(<BotOrientation />);

        const whiteOption = screen.getByTestId('white-option');
        const blackOption = screen.getByTestId('black-option');
        const randomOption = screen.getByTestId('random-option');

        expect(whiteOption).toHaveClass('orientation-selected');
        expect(blackOption).not.toHaveClass('orientation-selected');
        expect(randomOption).not.toHaveClass('orientation-selected');
    });

    describe('orientation selection', () => {
        it('selects white orientation when white is clicked', () => {
            render(<BotOrientation />);
            
            const whiteOption = screen.getByTestId('white-option');
            fireEvent.click(whiteOption!);

            expect(mockSetOrientation).toHaveBeenCalledWith('w');
            expect(whiteOption).toHaveClass('orientation-selected');
        });

        it('selects black orientation when black is clicked', () => {
            render(<BotOrientation />);
            
            const blackOption = screen.getByTestId('black-option');
            fireEvent.click(blackOption!);

            expect(mockSetOrientation).toHaveBeenCalledWith('b');
            expect(blackOption).toHaveClass('orientation-selected');
        });

        it('selects random orientation when random is clicked', () => {
            const mockMath = Object.create(global.Math);
            mockMath.random = () => 0.4;
            global.Math = mockMath;

            render(<BotOrientation />);
            
            const randomOption = screen.getByTestId('random-option');
            fireEvent.click(randomOption!);

            expect(mockSetOrientation).toHaveBeenCalledWith('w');
            expect(randomOption).toHaveClass('orientation-selected');
        });

        it('handles random selection for black correctly', () => {
            const mockMath = Object.create(global.Math);
            mockMath.random = () => 0.7;
            global.Math = mockMath;

            render(<BotOrientation />);
            
            const randomOption = screen.getByTestId('random-option');
            fireEvent.click(randomOption!);

            expect(mockSetOrientation).toHaveBeenCalledWith('b');
            expect(randomOption).toHaveClass('orientation-selected');
        });
    });

    it('applies correct CSS classes to options', () => {
        render(<BotOrientation />);

        const whiteOption = screen.getByTestId('white-option');
        const blackOption = screen.getByTestId('black-option');
        const randomOption = screen.getByTestId('random-option');

        expect(whiteOption).toHaveClass('solid-color');
        expect(blackOption).toHaveClass('solid-color');
        expect(randomOption).toHaveClass('split-color');
    });
});