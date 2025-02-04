import React from 'react';
import { render, screen } from '@testing-library/react';
import BotInGameStats from './BotInGameStats';
import { useBot } from '../../../Providers/BotProvider/BotProvider';
import { usePlayer } from '../../../Providers/PlayerProvider/PlayerProvider';
import { useCapturedPieces } from '../../../Hooks/useCapturedPieces/useCapturedPieces';

jest.mock('../../../Providers/BotProvider/BotProvider');
jest.mock('../../../Providers/PlayerProvider/PlayerProvider');
jest.mock('../../../Hooks/useCapturedPieces/useCapturedPieces');

jest.mock('../../Dashboard/InGameStats/GameStats/GameStats', () => ({
    __esModule: true,
    default: ({ username, elo, isTurn, isLoading }: { 
        username: string; 
        elo: string | number;
        isTurn: boolean;
        isLoading: boolean;
    }) => (
        <div 
            data-testid="game-stats" 
            className={isTurn ? 'turn-active' : ''}
        >
            <span>{username}</span>
            <span>{elo}</span>
            {isLoading && <div data-testid="loading-dots" />}
        </div>
    )
}));

jest.mock('../../Dashboard/InGameStats/HistoryMoves/HistoryMoves', () => ({
    __esModule: true,
    default: () => <div data-testid="history-moves">History Moves</div>
}));

jest.mock('./BotInGameHelp/BotInGameHelp', () => ({
    __esModule: true,
    default: () => (
        <div data-testid="bot-in-game-help">
            <div data-testid="help-card">Undo</div>
            <div data-testid="help-card">Hint</div>
        </div>
    )
}));

describe('BotInGameStats', () => {
    const mockBotGame = {
        playerA: { connected: true },
        playerB: { connected: true }
    };

    const mockUseBot = {
        orientation: 'w',
        playerTurn: 'w',
        botGame: mockBotGame,
        history: [],
        gameMoves: [],
        setGameMoves: jest.fn(),
        difficulty: 'novice',
        help: 'standard'
    };

    const mockUsePlayer = {
        playerStatic: {
            username: 'TestPlayer'
        },
        playerDynamic: {
            elo: 1200
        }
    };

    const mockUseCapturedPieces = {
        playerPieces: [],
        opponentPieces: []
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useBot as jest.Mock).mockReturnValue(mockUseBot);
        (usePlayer as jest.Mock).mockReturnValue(mockUsePlayer);
        (useCapturedPieces as jest.Mock).mockReturnValue(mockUseCapturedPieces);
    });

    it('renders bot and player stats', () => {
        render(<BotInGameStats />);

        expect(screen.getByText('Bot Novice')).toBeInTheDocument();
        expect(screen.getByText('< 1000')).toBeInTheDocument();
        expect(screen.getByText('TestPlayer')).toBeInTheDocument();
        expect(screen.getByText('1200')).toBeInTheDocument();
    });

    it('shows help section when help is not "challenge"', () => {
        render(<BotInGameStats />);
        
        const helpCards = screen.getAllByTestId('help-card');
        expect(helpCards).toHaveLength(2);
    });

    it('hides help section when help is "challenge"', () => {
        (useBot as jest.Mock).mockReturnValue({
            ...mockUseBot,
            help: 'challenge'
        });
        render(<BotInGameStats />);
        
        const helpCards = screen.queryAllByTestId('help-card');
        expect(helpCards).toHaveLength(0);
    });

    it('shows correct bot difficulty label and range', () => {
        (useBot as jest.Mock).mockReturnValue({
            ...mockUseBot,
            difficulty: 'master'
        });
        render(<BotInGameStats />);

        expect(screen.getByText('Bot Master')).toBeInTheDocument();
        expect(screen.getByText('> 2000')).toBeInTheDocument();
    });

    it('shows loading state for bot when room is not full', () => {
        (useBot as jest.Mock).mockReturnValue({
            ...mockUseBot,
            botGame: {
                playerA: { connected: true },
                playerB: { connected: false }
            }
        });
        render(<BotInGameStats />);

        const loadingIndicators = screen.getAllByTestId('loading-dots');
        expect(loadingIndicators).toHaveLength(1);
    });

    it('shows correct turn indicators based on orientation and playerTurn', () => {
        (useBot as jest.Mock).mockReturnValue({
            ...mockUseBot,
            orientation: 'w',
            playerTurn: 'w'
        });
        render(<BotInGameStats />);

        const playerStats = screen.getAllByTestId('game-stats');
        expect(playerStats[1]).toHaveClass('turn-active');
        expect(playerStats[0]).not.toHaveClass('turn-active');
    });

    it('shows correct turn indicators when player is black', () => {
        (useBot as jest.Mock).mockReturnValue({
            ...mockUseBot,
            orientation: 'b',
            playerTurn: 'b'
        });
        render(<BotInGameStats />);

        const playerStats = screen.getAllByTestId('game-stats');
        expect(playerStats[1]).toHaveClass('turn-active');
        expect(playerStats[0]).not.toHaveClass('turn-active');
    });

    it('uses default username when playerStatic is null', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            ...mockUsePlayer,
            playerStatic: null
        });
        render(<BotInGameStats />);

        expect(screen.getByText('Player')).toBeInTheDocument();
    });

    it('uses default elo when playerDynamic is null', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            ...mockUsePlayer,
            playerDynamic: null
        });
        render(<BotInGameStats />);

        expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('renders history moves component', () => {
        render(<BotInGameStats />);
        
        expect(screen.getByTestId('history-moves')).toBeInTheDocument();
    });
});