import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotLobby from './BotLobby';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

// Mock all child components
jest.mock('./BotLobbyTitle/BotLobbyTitle', () => ({
    __esModule: true,
    default: () => <div data-testid="bot-lobby-title">Bot Lobby Title</div>
}));

jest.mock('./BotOptionList/BotOptionList', () => ({
    __esModule: true,
    default: () => <div data-testid="bot-option-list">Bot Option List</div>
}));

jest.mock('./BotSettings/BotSettings', () => ({
    __esModule: true,
    default: () => <div data-testid="bot-settings">Bot Settings</div>
}));

jest.mock('../../Button/Button', () => ({
    __esModule: true,
    default: ({ onClick, disabled, children }: { 
        onClick: () => void;
        disabled?: boolean;
        children: React.ReactNode;
    }) => (
        <button 
            data-testid="play-button"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}));

jest.mock('../../LoadingDots/LoadingDots', () => ({
    __esModule: true,
    default: () => <div data-testid="loading-dots">Loading...</div>
}));

jest.mock('../../../Providers/BotProvider/BotProvider');

describe('BotLobby', () => {
    const mockHandleCreateBotGame = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useBot as jest.Mock).mockReturnValue({
            handleCreateBotGame: mockHandleCreateBotGame,
            loadingCreateGame: false
        });
    });

    it('renders all main components', () => {
        render(<BotLobby />);

        expect(screen.getByTestId('bot-lobby-title')).toBeInTheDocument();
        expect(screen.getByTestId('bot-option-list')).toBeInTheDocument();
        expect(screen.getByTestId('bot-settings')).toBeInTheDocument();
        expect(screen.getByTestId('play-button')).toBeInTheDocument();
    });

    it('shows "Play" text when not loading', () => {
        render(<BotLobby />);
        
        expect(screen.getByTestId('play-button')).toHaveTextContent('Play');
        expect(screen.queryByTestId('loading-dots')).not.toBeInTheDocument();
    });

    it('shows loading dots when loading', () => {
        (useBot as jest.Mock).mockReturnValue({
            handleCreateBotGame: mockHandleCreateBotGame,
            loadingCreateGame: true
        });

        render(<BotLobby />);
        
        expect(screen.queryByText('Play')).not.toBeInTheDocument();
        expect(screen.getByTestId('loading-dots')).toBeInTheDocument();
    });

    it('disables play button when loading', () => {
        (useBot as jest.Mock).mockReturnValue({
            handleCreateBotGame: mockHandleCreateBotGame,
            loadingCreateGame: true
        });

        render(<BotLobby />);
        
        expect(screen.getByTestId('play-button')).toBeDisabled();
    });

    it('calls handleCreateBotGame when play button is clicked', () => {
        render(<BotLobby />);
        
        fireEvent.click(screen.getByTestId('play-button'));
        expect(mockHandleCreateBotGame).toHaveBeenCalledTimes(1);
    });

    it('applies correct CSS class to container', () => {
        render(<BotLobby />);
        
        expect(screen.getByTestId('bot-lobby')).toHaveClass('bot-lobby');
    });
});