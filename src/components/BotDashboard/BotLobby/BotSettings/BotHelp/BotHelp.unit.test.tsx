import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotHelp from './BotHelp';
import { useBot } from '../../../../../Providers/BotProvider/BotProvider';
import flameYellow from "../../../../../Images/flame yellow.svg";
import flameGrey from "../../../../../Images/flame grey.svg";

jest.mock('../../../../../Providers/BotProvider/BotProvider');

describe('BotHelp', () => {
    const mockSetHelp = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useBot as jest.Mock).mockReturnValue({
            help: 'friendly',
            setHelp: mockSetHelp
        });
    });

    it('renders the component with correct title case help text', () => {
        render(<BotHelp />);
        expect(screen.getByText('Friendly')).toBeInTheDocument();
    });

    it('renders correct help description for each mode', () => {
        render(<BotHelp />);
        expect(screen.getByText('Hints & Takebacks')).toBeInTheDocument();

        (useBot as jest.Mock).mockReturnValue({
            help: 'assisted',
            setHelp: mockSetHelp
        });
        render(<BotHelp />);
        expect(screen.getByText('Full help')).toBeInTheDocument();

        (useBot as jest.Mock).mockReturnValue({
            help: 'challenge',
            setHelp: mockSetHelp
        });
        render(<BotHelp />);
        expect(screen.getByText('No help')).toBeInTheDocument();
    });

    describe('flame rendering', () => {
        it('renders correct flame configuration for assisted mode', () => {
            (useBot as jest.Mock).mockReturnValue({
                help: 'assisted',
                setHelp: mockSetHelp
            });
            render(<BotHelp />);

            const flames = screen.getAllByRole('img');
            expect(flames[0].getAttribute('src')).toBe(flameYellow);
            expect(flames[1].getAttribute('src')).toBe(flameGrey);
            expect(flames[2].getAttribute('src')).toBe(flameGrey);
        });

        it('renders correct flame configuration for friendly mode', () => {
            (useBot as jest.Mock).mockReturnValue({
                help: 'friendly',
                setHelp: mockSetHelp
            });
            render(<BotHelp />);

            const flames = screen.getAllByRole('img');
            expect(flames[0].getAttribute('src')).toBe(flameYellow);
            expect(flames[1].getAttribute('src')).toBe(flameYellow);
            expect(flames[2].getAttribute('src')).toBe(flameGrey);
        });

        it('renders correct flame configuration for challenge mode', () => {
            (useBot as jest.Mock).mockReturnValue({
                help: 'challenge',
                setHelp: mockSetHelp
            });
            render(<BotHelp />);

            const flames = screen.getAllByRole('img');
            expect(flames[0].getAttribute('src')).toBe(flameYellow);
            expect(flames[1].getAttribute('src')).toBe(flameYellow);
            expect(flames[2].getAttribute('src')).toBe(flameYellow);
        });
    });

    describe('flame click handling', () => {
        it('sets help to "assisted" when first flame is clicked', () => {
            render(<BotHelp />);
            fireEvent.click(screen.getByTestId('flame-button-0'));
            expect(mockSetHelp).toHaveBeenCalledWith('assisted');
        });

        it('sets help to "friendly" when second flame is clicked', () => {
            render(<BotHelp />);
            fireEvent.click(screen.getByTestId('flame-button-1'));
            expect(mockSetHelp).toHaveBeenCalledWith('friendly');
        });

        it('sets help to "challenge" when third flame is clicked', () => {
            render(<BotHelp />);
            fireEvent.click(screen.getByTestId('flame-button-2'));
            expect(mockSetHelp).toHaveBeenCalledWith('challenge');
        });
    });

    it('renders correct number of flames', () => {
        render(<BotHelp />);
        const flames = screen.getAllByRole('img');
        expect(flames).toHaveLength(3);
    });

    it('renders flames with correct alt text', () => {
        render(<BotHelp />);
        expect(screen.getByAltText('Flame 1')).toBeInTheDocument();
        expect(screen.getByAltText('Flame 2')).toBeInTheDocument();
        expect(screen.getByAltText('Flame 3')).toBeInTheDocument();
    });
});