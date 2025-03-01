import React from 'react';
import { render, screen } from '@testing-library/react';
import GlobalStats from './GlobalStats';
import { useGlobalStats } from '../../../../Hooks/useGlobalStats/useGlobalStats';

// Mock the useGlobalStats hook
jest.mock('../../../../Hooks/useGlobalStats/useGlobalStats');

describe('GlobalStats', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders global statistics with correct values', () => {
        // Mock the return value of useGlobalStats
        (useGlobalStats as jest.Mock).mockReturnValue({
            globalPlayersCount: 100,
            globalGamesCount: 200,
        });

        render(<GlobalStats />);

        // Check if the player count is displayed using data-testid
        expect(screen.getByTestId('global-players-count')).toHaveTextContent('100');
        expect(screen.getByText('TOTAL PLAYERS')).toBeInTheDocument();

        // Check if the game count is displayed using data-testid
        expect(screen.getByTestId('global-games-count')).toHaveTextContent('200');
        expect(screen.getByText('TOTAL GAMES')).toBeInTheDocument();
    });

    it('renders with default values when no data is available', () => {
        // Mock the return value of useGlobalStats with default values
        (useGlobalStats as jest.Mock).mockReturnValue({
            globalPlayersCount: 0,
            globalGamesCount: 0,
        });

        render(<GlobalStats />);

        // Check if the player count is displayed as 0 using data-testid
        expect(screen.getByTestId('global-players-count')).toHaveTextContent('0');
        expect(screen.getByText('TOTAL PLAYERS')).toBeInTheDocument();

        // Check if the game count is displayed as 0 using data-testid
        expect(screen.getByTestId('global-games-count')).toHaveTextContent('0');
        expect(screen.getByText('TOTAL GAMES')).toBeInTheDocument();
    });
});
