import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReconnectBotGameBadge from './ReconnectBotGameBadge';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

jest.mock('../../../Providers/BotProvider/BotProvider', () => ({
    useBot: jest.fn()
}));

describe('ReconnectBotGameBadge Component', () => {
    const mockSetReconnectGame = jest.fn();
    const successMessage = "Successfully reconnected to the active bot game.";

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useBot as jest.Mock).mockReturnValue({
            reconnectGame: false,
            setReconnectGame: mockSetReconnectGame
        });
    });

    it('should not display alert when reconnectGame is false', () => {
        render(<ReconnectBotGameBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display success alert when reconnectGame is true', () => {
        (useBot as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectBotGameBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(successMessage)).toBeInTheDocument();
    });

    it('should call setReconnectGame with false when close button is clicked', () => {
        (useBot as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectBotGameBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetReconnectGame).toHaveBeenCalledWith(false);
    });

    it('should update alert when reconnectGame changes', () => {
        const { rerender } = render(<ReconnectBotGameBadge />);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        (useBot as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        rerender(<ReconnectBotGameBadge />);
        expect(screen.getByText(successMessage)).toBeInTheDocument();
    });

    it('should have success severity when displaying reconnect message', () => {
        (useBot as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectBotGameBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
    });

    it('should display the correct success message', () => {
        (useBot as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectBotGameBadge />);
        expect(screen.getByText(successMessage)).toBeInTheDocument();
    });
});