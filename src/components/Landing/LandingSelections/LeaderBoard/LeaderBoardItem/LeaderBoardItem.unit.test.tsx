import React from 'react';
import { render, screen } from '@testing-library/react';
import LeaderBoardItem from './LeaderBoardItem';

describe('LeaderBoardItem', () => {
    const mockPlayer = {
        id: '1',
        username: 'Player1',
        elo: 1500,
    };

    it('renders the player information correctly', () => {
        render(<LeaderBoardItem player={mockPlayer} index={0} />); // 1st place

        expect(screen.getByText('1.')).toBeInTheDocument();
        expect(screen.getByText('Player1')).toBeInTheDocument();
        expect(screen.getByText('1500')).toBeInTheDocument();
        expect(screen.getByAltText('1 place medal')).toBeInTheDocument(); // Check for gold medal
    });

    it('renders the correct medal for 2nd place', () => {
        render(<LeaderBoardItem player={mockPlayer} index={1} />); // 2nd place

        expect(screen.getByAltText('2 place medal')).toBeInTheDocument(); // Check for silver medal
    });

    it('renders the correct medal for 3rd place', () => {
        render(<LeaderBoardItem player={mockPlayer} index={2} />); // 3rd place

        expect(screen.getByAltText('3 place medal')).toBeInTheDocument(); // Check for bronze medal
    });

    it('renders the default medal for 4th place and below', () => {
        render(<LeaderBoardItem player={mockPlayer} index={3} />); // 4th place

        expect(screen.getByAltText('4 place medal')).toBeInTheDocument(); // Check for default medal
    });

    it('applies the correct classes based on rank', () => {
        render(<LeaderBoardItem player={mockPlayer} index={0} />); // 1st place
        expect(screen.getByTestId('leaderboard-item-0-color')).toHaveClass('odd-color');

        render(<LeaderBoardItem player={mockPlayer} index={1} />); // 2nd place
        expect(screen.getByTestId('leaderboard-item-1-color')).toHaveClass('even-color');
    });
}); 