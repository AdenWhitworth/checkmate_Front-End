import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import BotInGameHelp from './BotInGameHelp';
import { useBot } from '../../../../Providers/BotProvider/BotProvider';

jest.mock('../../../../Providers/BotProvider/BotProvider');

describe('BotInGameHelp', () => {
    const mockUseBot = {
        remainingUndos: 3,
        remainingHints: 3,
        undoPreviousMove: jest.fn(),
        requestHint: jest.fn(),
        loadingHint: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useBot as jest.Mock).mockReturnValue(mockUseBot);
    });

    it('renders both help cards', () => {
        render(<BotInGameHelp />);

        expect(screen.getByAltText('Undo Icon')).toBeInTheDocument();
        expect(screen.getByAltText('Hint Icon')).toBeInTheDocument();
        expect(screen.getByText('Undo')).toBeInTheDocument();
        expect(screen.getByText('Hint')).toBeInTheDocument();
    });

    describe('Undo functionality', () => {
        it('shows correct number of remaining undos', () => {
            (useBot as jest.Mock).mockReturnValue({ ...mockUseBot, remainingUndos: 2 });
            render(<BotInGameHelp />);

            const helpCards = screen.getAllByTestId('help-card');
            const undoCard = helpCards[0];
            const activeTallyDots = within(undoCard).getAllByTestId('tally-dot')
                .filter((dot: HTMLElement) => dot.classList.contains('active-tally'));
            expect(activeTallyDots).toHaveLength(2);
        });

        it('disables undo when no remaining undos', () => {
            (useBot as jest.Mock).mockReturnValue({ ...mockUseBot, remainingUndos: 0 });
            render(<BotInGameHelp />);

            const helpCards = screen.getAllByTestId('help-card');
            expect(helpCards[0]).toHaveClass('card-disable');
        });

        it('calls undoPreviousMove when undo card is clicked', () => {
            render(<BotInGameHelp />);

            const helpCards = screen.getAllByTestId('help-card');
            fireEvent.click(helpCards[0]);
            expect(mockUseBot.undoPreviousMove).toHaveBeenCalled();
        });

        it('hides tally when remainingUndos is -1', () => {
            (useBot as jest.Mock).mockReturnValue({ ...mockUseBot, remainingUndos: -1 });
            render(<BotInGameHelp />);

            const tallyDots = screen.queryAllByTestId('tally-dots');
            expect(tallyDots).toHaveLength(1);
        });
    });

    describe('Hint functionality', () => {
        it('shows correct number of remaining hints', () => {
            (useBot as jest.Mock).mockReturnValue({ ...mockUseBot, remainingHints: 2 });
            render(<BotInGameHelp />);

            const helpCards = screen.getAllByTestId('help-card');
            const hintCard = helpCards[1];
            const activeTallyDots = within(hintCard).getAllByTestId('tally-dot')
                .filter((dot: HTMLElement) => dot.classList.contains('active-tally'));
            expect(activeTallyDots).toHaveLength(2);
        });

        it('disables hint when no remaining hints', () => {
            (useBot as jest.Mock).mockReturnValue({ ...mockUseBot, remainingHints: 0 });
            render(<BotInGameHelp />);

            const helpCards = screen.getAllByTestId('help-card');
            expect(helpCards[1]).toHaveClass('card-disable');
        });

        it('calls requestHint when hint card is clicked', () => {
            render(<BotInGameHelp />);

            const helpCards = screen.getAllByTestId('help-card');
            fireEvent.click(helpCards[1]);
            expect(mockUseBot.requestHint).toHaveBeenCalled();
        });

        it('shows loading state when loadingHint is true', () => {
            (useBot as jest.Mock).mockReturnValue({ ...mockUseBot, loadingHint: true });
            render(<BotInGameHelp />);

            expect(screen.getByTestId('loading-dots')).toBeInTheDocument();
        });

        it('hides tally when remainingHints is -1', () => {
            (useBot as jest.Mock).mockReturnValue({ ...mockUseBot, remainingHints: -1 });
            render(<BotInGameHelp />);

            const tallyDots = screen.queryAllByTestId('tally-dots');
            expect(tallyDots).toHaveLength(1);
        });
    });
});