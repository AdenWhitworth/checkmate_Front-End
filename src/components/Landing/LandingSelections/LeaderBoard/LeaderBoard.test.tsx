import React from 'react';
import { render, screen } from '@testing-library/react';
import LeaderBoard from './LeaderBoard';
import { useLeaderBoard } from '../../../../Hooks/useLeaderBoard/useLeaderBoard';

// Mock the useLeaderBoard hook
jest.mock('../../../../Hooks/useLeaderBoard/useLeaderBoard');

// Mock the LoadingSpinner and ErrorLoading components
jest.mock('../../../LoadingSpinner/LoadingSpinner', () => () => <div>Loading...</div>);
jest.mock('../../../ErrorLoading/ErrorLoading', () => ({ message }: {message: string}) => <div>{message}</div>);

describe('LeaderBoard Component', () => {
    const mockPlayer = {
        id: '1',
        username: 'Player1',
        elo: 1500,
    };
    
    it('renders loading spinner when loading', () => {
        (useLeaderBoard as jest.Mock).mockReturnValue({
            leaderBoardPlayers: [],
            loadingLeaders: true,
            leadersError: null,
        });

        render(<LeaderBoard />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders error message when there is an error', () => {
        (useLeaderBoard as jest.Mock).mockReturnValue({
            leaderBoardPlayers: [],
            loadingLeaders: false,
            leadersError: 'Error loading leaders',
        });

        render(<LeaderBoard />);
        expect(screen.getByText(/error loading leaders/i)).toBeInTheDocument();
    });

    it('renders the leaderboard when data is available', () => {
        (useLeaderBoard as jest.Mock).mockReturnValue({
            leaderBoardPlayers: [mockPlayer],
            loadingLeaders: false,
            leadersError: null,
        });

        render(<LeaderBoard />);
        expect(screen.getByText(/leader board/i)).toBeInTheDocument();
        expect(screen.getByText(/player1/i)).toBeInTheDocument();
    });
}); 