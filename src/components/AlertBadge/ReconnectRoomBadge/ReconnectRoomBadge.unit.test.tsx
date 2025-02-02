import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReconnectRoomBadge from './ReconnectRoomBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';

jest.mock('../../../Providers/GameProvider/GameProvider', () => ({
    useGame: jest.fn()
}));

describe('ReconnectRoomBadge Component', () => {
    const mockSetReconnectGame = jest.fn();
    const successMessage = "Successfully reconnected to the active game.";

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useGame as jest.Mock).mockReturnValue({
            reconnectGame: false,
            setReconnectGame: mockSetReconnectGame
        });
    });

    it('should not display alert when reconnectGame is false', () => {
        render(<ReconnectRoomBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display success alert when reconnectGame is true', () => {
        (useGame as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectRoomBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(successMessage)).toBeInTheDocument();
    });

    it('should call setReconnectGame with false when close button is clicked', () => {
        (useGame as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectRoomBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetReconnectGame).toHaveBeenCalledWith(false);
    });

    it('should update alert when reconnectGame changes', () => {
        const { rerender } = render(<ReconnectRoomBadge />);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        (useGame as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        rerender(<ReconnectRoomBadge />);
        expect(screen.getByText(successMessage)).toBeInTheDocument();
    });

    it('should have success severity when displaying reconnect message', () => {
        (useGame as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectRoomBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
    });

    it('should display the correct success message', () => {
        (useGame as jest.Mock).mockReturnValue({
            reconnectGame: true,
            setReconnectGame: mockSetReconnectGame
        });

        render(<ReconnectRoomBadge />);
        expect(screen.getByText(successMessage)).toBeInTheDocument();
    });
});