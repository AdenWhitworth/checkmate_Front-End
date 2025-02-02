import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OpponentReconnectRoomBadge from './OpponentReconnectRoomBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';

jest.mock('../../../Providers/GameProvider/GameProvider', () => ({
    useGame: jest.fn()
}));

describe('OpponentReconnectRoomBadge Component', () => {
    const mockSetIsOpponentDisconnected = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useGame as jest.Mock).mockReturnValue({
            isOpponentDisconnected: null,
            setIsOpponentDisconnected: mockSetIsOpponentDisconnected
        });
    });

    it('should not display alert when isOpponentDisconnected is null', () => {
        render(<OpponentReconnectRoomBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should not display alert when isOpponentDisconnected does not include "reconnected"', () => {
        (useGame as jest.Mock).mockReturnValue({
            isOpponentDisconnected: 'disconnected',
            setIsOpponentDisconnected: mockSetIsOpponentDisconnected
        });

        render(<OpponentReconnectRoomBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display success alert when opponent has reconnected', () => {
        const reconnectMessage = 'Opponent has reconnected';
        (useGame as jest.Mock).mockReturnValue({
            isOpponentDisconnected: reconnectMessage,
            setIsOpponentDisconnected: mockSetIsOpponentDisconnected
        });

        render(<OpponentReconnectRoomBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(reconnectMessage)).toBeInTheDocument();
    });

    it('should call setIsOpponentDisconnected with null when close button is clicked', () => {
        const reconnectMessage = 'Opponent has reconnected';
        (useGame as jest.Mock).mockReturnValue({
            isOpponentDisconnected: reconnectMessage,
            setIsOpponentDisconnected: mockSetIsOpponentDisconnected
        });

        render(<OpponentReconnectRoomBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetIsOpponentDisconnected).toHaveBeenCalledWith(null);
    });

    it('should update alert when isOpponentDisconnected changes', () => {
        const { rerender } = render(<OpponentReconnectRoomBadge />);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const reconnectMessage = 'Opponent has reconnected';
        (useGame as jest.Mock).mockReturnValue({
            isOpponentDisconnected: reconnectMessage,
            setIsOpponentDisconnected: mockSetIsOpponentDisconnected
        });

        rerender(<OpponentReconnectRoomBadge />);
        expect(screen.getByText(reconnectMessage)).toBeInTheDocument();
    });

    it('should have success severity when displaying reconnect message', () => {
        const reconnectMessage = 'Opponent has reconnected';
        (useGame as jest.Mock).mockReturnValue({
            isOpponentDisconnected: reconnectMessage,
            setIsOpponentDisconnected: mockSetIsOpponentDisconnected
        });

        render(<OpponentReconnectRoomBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
    });
});