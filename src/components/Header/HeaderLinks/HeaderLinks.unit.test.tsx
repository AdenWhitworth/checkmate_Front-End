import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeaderLinks from './HeaderLinks';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { usePlayer } from '../../../Providers/PlayerProvider/PlayerProvider';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

jest.mock('../../../Providers/AuthProvider/AuthProvider');
jest.mock('../../../Providers/GameProvider/GameProvider', () => ({
    useGame: jest.fn(() => ({
        game: null,
    })),
}));
jest.mock('../../../Providers/PlayerProvider/PlayerProvider', () => ({
    usePlayer: jest.fn(() => ({
        invitesCount: 0,
    })),
}));
jest.mock('../../../Providers/BotProvider/BotProvider');
jest.mock('../../../Providers/BotProvider/BotProvider', () => ({
    useBot: jest.fn(() => ({
        botGame: null,
    })),
}));

describe('HeaderLinks', () => {
    const mockHandleArrowClick = jest.fn();
    const mockHandleBadgeClick = jest.fn();
    const mockHandleFlagClick = jest.fn();
    const mockHandleLoginClick = jest.fn();
    const mockHandleLogoutClick = jest.fn();
    const mockHandleSignupClick = jest.fn();
    const mockHandleProfileClick = jest.fn();
    const mockHandleBotFlagClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders authentication buttons when no user is logged in', () => {
        (useAuth as jest.Mock).mockReturnValue({ currentUser: null, loadingAuth: false });

        render(<HeaderLinks 
            handleArrowClick={mockHandleArrowClick} 
            handleBadgeClick={mockHandleBadgeClick} 
            handleFlagClick={mockHandleFlagClick} 
            handleLoginClick={mockHandleLoginClick} 
            handleLogoutClick={mockHandleLogoutClick} 
            handleSignupClick={mockHandleSignupClick} 
            handleProfileClick={mockHandleProfileClick} 
            handleBotFlagClick={mockHandleBotFlagClick} 
            isMenuOpen={false} 
        />);

        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.getByText('Log In')).toBeInTheDocument();
    });

    it('renders logged-in buttons when a user is logged in and no active room', () => {
        (useAuth as jest.Mock).mockReturnValue({ currentUser: {}, loadingAuth: false });
        (useGame as jest.Mock).mockReturnValue({ game: null });
        (usePlayer as jest.Mock).mockReturnValue({ invitesCount: 3 });
        (useBot as jest.Mock).mockReturnValue({ botGame: null });

        render(<HeaderLinks 
            handleArrowClick={mockHandleArrowClick} 
            handleBadgeClick={mockHandleBadgeClick} 
            handleFlagClick={mockHandleFlagClick} 
            handleLoginClick={mockHandleLoginClick} 
            handleLogoutClick={mockHandleLogoutClick} 
            handleSignupClick={mockHandleSignupClick} 
            handleProfileClick={mockHandleProfileClick} 
            handleBotFlagClick={mockHandleBotFlagClick} 
            isMenuOpen={false} 
        />);

        expect(screen.getByText('Log out')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /Notifications/i })).toBeInTheDocument();
        expect(screen.getByTestId("profile-circle")).toBeInTheDocument();
    });

    it('renders in-game buttons when a game is active', () => {
        (useAuth as jest.Mock).mockReturnValue({ currentUser: {}, loadingAuth: false });
        (useGame as jest.Mock).mockReturnValue({ game: { playerA: { connected: true }, playerB: { connected: false } } });
        (usePlayer as jest.Mock).mockReturnValue({ invitesCount: 0 });
        (useBot as jest.Mock).mockReturnValue({ botGame: null });

        render(<HeaderLinks 
            handleArrowClick={mockHandleArrowClick} 
            handleBadgeClick={mockHandleBadgeClick} 
            handleFlagClick={mockHandleFlagClick} 
            handleLoginClick={mockHandleLoginClick} 
            handleLogoutClick={mockHandleLogoutClick} 
            handleSignupClick={mockHandleSignupClick} 
            handleProfileClick={mockHandleProfileClick} 
            handleBotFlagClick={mockHandleBotFlagClick} 
            isMenuOpen={false} 
        />);

        expect(screen.getByRole('img', { name: /Exit Game/i })).toBeInTheDocument();
        expect(screen.queryByRole('img', { name: /End Game/i })).not.toBeInTheDocument();
    });

    it('renders end game flag when the game is full', () => {
        (useAuth as jest.Mock).mockReturnValue({ currentUser: {}, loadingAuth: false });
        (useGame as jest.Mock).mockReturnValue({ game: { playerA: { connected: true }, playerB: { connected: true } } });
        (usePlayer as jest.Mock).mockReturnValue({ invitesCount: 0 });
        (useBot as jest.Mock).mockReturnValue({ botGame: null });

        render(<HeaderLinks 
            handleArrowClick={mockHandleArrowClick} 
            handleBadgeClick={mockHandleBadgeClick} 
            handleFlagClick={mockHandleFlagClick} 
            handleLoginClick={mockHandleLoginClick} 
            handleLogoutClick={mockHandleLogoutClick} 
            handleSignupClick={mockHandleSignupClick} 
            handleProfileClick={mockHandleProfileClick} 
            handleBotFlagClick={mockHandleBotFlagClick} 
            isMenuOpen={false} 
        />);

        expect(screen.getByRole('img', { name: /End Game/i })).toBeInTheDocument();
    });

    it('calls the appropriate handlers when buttons are clicked', () => {
        // Initial state: unsigned in
        (useAuth as jest.Mock).mockReturnValue({ currentUser: null, loadingAuth: false });
        (useGame as jest.Mock).mockReturnValue({ game: null });
        (usePlayer as jest.Mock).mockReturnValue({ invitesCount: 0 });
        (useBot as jest.Mock).mockReturnValue({ botGame: null });

        // Render the component for the first time
        const { rerender } = render(<HeaderLinks 
            handleArrowClick={mockHandleArrowClick} 
            handleBadgeClick={mockHandleBadgeClick} 
            handleFlagClick={mockHandleFlagClick} 
            handleLoginClick={mockHandleLoginClick} 
            handleLogoutClick={mockHandleLogoutClick} 
            handleSignupClick={mockHandleSignupClick} 
            handleProfileClick={mockHandleProfileClick} 
            handleBotFlagClick={mockHandleBotFlagClick} 
            isMenuOpen={false} 
        />);

        // Simulate Sign Up
        fireEvent.click(screen.getByText('Sign Up'));
        expect(mockHandleSignupClick).toHaveBeenCalled();

        // Simulate Log In
        fireEvent.click(screen.getByText('Log In'));
        expect(mockHandleLoginClick).toHaveBeenCalled();

        // Now simulate signed-in state
        (useAuth as jest.Mock).mockReturnValue({ currentUser: { username: 'Alice' }, loadingAuth: false });
        (useGame as jest.Mock).mockReturnValue({ game: null });

        // Use rerender to update the component with the new state
        rerender(<HeaderLinks 
            handleArrowClick={mockHandleArrowClick} 
            handleBadgeClick={mockHandleBadgeClick} 
            handleFlagClick={mockHandleFlagClick} 
            handleLoginClick={mockHandleLoginClick} 
            handleLogoutClick={mockHandleLogoutClick} 
            handleSignupClick={mockHandleSignupClick} 
            handleProfileClick={mockHandleProfileClick} 
            handleBotFlagClick={mockHandleBotFlagClick} 
            isMenuOpen={false} 
        />);

        // Check for signed-in elements
        expect(screen.getByRole('img', { name: /Notifications/i })).toBeInTheDocument();
        expect(screen.getByText('Log out')).toBeInTheDocument();

        // Simulate clicking the notification icon
        fireEvent.click(screen.getByRole('img', { name: /Notifications/i }));
        expect(mockHandleBadgeClick).toHaveBeenCalled();

        // Simulate Log out
        fireEvent.click(screen.getByText('Log out'));
        expect(mockHandleLogoutClick).toHaveBeenCalled();
    });
});
