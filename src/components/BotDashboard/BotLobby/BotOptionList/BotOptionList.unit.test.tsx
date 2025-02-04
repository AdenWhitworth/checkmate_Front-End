import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotOptionList from './BotOptionList';
import { useBot } from '../../../../Providers/BotProvider/BotProvider';

jest.mock('../../../../Providers/BotProvider/BotProvider');

jest.mock('./BotOption/BotOption', () => ({
    __esModule: true,
    default: ({ label, range, isSelected, onClick }: { 
        label: string;
        range: string;
        isSelected: boolean;
        onClick: () => void;
    }) => (
        <div 
            data-testid="bot-option"
            data-selected={isSelected}
            onClick={onClick}
        >
            <span>{label}</span>
            <span>{range}</span>
        </div>
    )
}));

describe('BotOptionList', () => {
    const mockSetDifficulty = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useBot as jest.Mock).mockReturnValue({
            difficulty: 'novice',
            setDifficulty: mockSetDifficulty
        });
    });

    it('renders all difficulty options', () => {
        render(<BotOptionList />);

        expect(screen.getByText('Novice')).toBeInTheDocument();
        expect(screen.getByText('Intermediate')).toBeInTheDocument();
        expect(screen.getByText('Advanced')).toBeInTheDocument();
        expect(screen.getByText('Master')).toBeInTheDocument();
    });

    it('renders correct ELO ranges for each option', () => {
        render(<BotOptionList />);

        expect(screen.getByText('< 1000')).toBeInTheDocument();
        expect(screen.getByText('1000-1500')).toBeInTheDocument();
        expect(screen.getByText('1500-2000')).toBeInTheDocument();
        expect(screen.getByText('> 2000')).toBeInTheDocument();
    });

    it('marks the currently selected difficulty option', () => {
        render(<BotOptionList />);

        const options = screen.getAllByTestId('bot-option');
        expect(options[0]).toHaveAttribute('data-selected', 'true');
        expect(options[1]).toHaveAttribute('data-selected', 'false');
        expect(options[2]).toHaveAttribute('data-selected', 'false');
        expect(options[3]).toHaveAttribute('data-selected', 'false');
    });

    it('calls setDifficulty when an option is clicked', () => {
        render(<BotOptionList />);

        const options = screen.getAllByTestId('bot-option');
        
        fireEvent.click(options[1]);
        expect(mockSetDifficulty).toHaveBeenCalledWith('intermediate');

        fireEvent.click(options[2]);
        expect(mockSetDifficulty).toHaveBeenCalledWith('advanced');

        fireEvent.click(options[3]);
        expect(mockSetDifficulty).toHaveBeenCalledWith('master');
    });

    it('updates selected option when difficulty changes', () => {
        (useBot as jest.Mock).mockReturnValue({
            difficulty: 'master',
            setDifficulty: mockSetDifficulty
        });

        render(<BotOptionList />);

        const options = screen.getAllByTestId('bot-option');
        expect(options[0]).toHaveAttribute('data-selected', 'false');
        expect(options[1]).toHaveAttribute('data-selected', 'false');
        expect(options[2]).toHaveAttribute('data-selected', 'false');
        expect(options[3]).toHaveAttribute('data-selected', 'true');
    });

    it('renders with correct number of options', () => {
        render(<BotOptionList />);

        const options = screen.getAllByTestId('bot-option');
        expect(options).toHaveLength(4);
    });
});