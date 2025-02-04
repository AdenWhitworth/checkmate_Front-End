import React from 'react';
import { render, screen } from '@testing-library/react';
import BotDashboard from './BotDashboard';
import { useBot } from '../../Providers/BotProvider/BotProvider';

// Mock all dependencies
jest.mock('../Header/Header', () => ({
    __esModule: true,
    default: () => <div data-testid="header">Header</div>
}));

jest.mock('../Dashboard/ActiveGame/ActiveGame', () => ({
    __esModule: true,
    default: () => <div data-testid="active-game">Active Game</div>
}));

jest.mock('./BotLobby/BotLobby', () => ({
    __esModule: true,
    default: () => <div data-testid="bot-lobby">Bot Lobby</div>
}));

jest.mock('./BotInGameStats/BotInGameStats', () => ({
    __esModule: true,
    default: () => <div data-testid="bot-in-game-stats">Bot In Game Stats</div>
}));

// Mock the BotProvider hook
jest.mock('../../Providers/BotProvider/BotProvider');

describe('BotDashboard', () => {
    const mockHandleReconnectBotGame = jest.fn();
    const defaultBotProps = {
        botGame: null,
        orientation: 'w',
        fen: 'starting-position',
        onDrop: jest.fn(),
        hint: null,
        onSquareClick: jest.fn(),
        highlightedSquares: [],
        onPromotionPieceSelect: jest.fn(),
        handleReconnectBotGame: mockHandleReconnectBotGame
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useBot as jest.Mock).mockReturnValue(defaultBotProps);
    });

    it('attempts to reconnect to bot game on mount', () => {
        render(<BotDashboard />);
        expect(mockHandleReconnectBotGame).toHaveBeenCalledTimes(1);
    });

    it('renders lobby when no active game', () => {
        render(<BotDashboard />);
        
        expect(screen.getByTestId('bot-lobby')).toBeInTheDocument();
        expect(screen.queryByTestId('bot-in-game-stats')).not.toBeInTheDocument();
    });

    it('renders in-game stats when there is an active game', () => {
        (useBot as jest.Mock).mockReturnValue({
            ...defaultBotProps,
            botGame: { id: '123' }
        });

        render(<BotDashboard />);
        
        expect(screen.getByTestId('bot-in-game-stats')).toBeInTheDocument();
        expect(screen.queryByTestId('bot-lobby')).not.toBeInTheDocument();
    });

    it('renders the game board', () => {
        render(<BotDashboard />);
        expect(screen.getByTestId('active-game')).toBeInTheDocument();
    });

    it('renders the header', () => {
        render(<BotDashboard />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });
});