import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JoinRoomAlertBadge from './JoinRoomAlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';

jest.mock('../../../Providers/GameProvider/GameProvider', () => ({
    useGame: jest.fn()
}));

describe('JoinRoomAlertBadge Component', () => {
    const mockSetErrorJoinGame = jest.fn();
    const mockSetSuccessJoinGame = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useGame as jest.Mock).mockReturnValue({
            errorJoinGame: null,
            successJoinGame: null,
            setErrorJoinGame: mockSetErrorJoinGame,
            setSuccessJoinGame: mockSetSuccessJoinGame
        });
    });

    it('should not display alert when both error and success are null', () => {
        render(<JoinRoomAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display error alert when errorJoinGame is set', () => {
        const testError = 'Failed to join game room';
        (useGame as jest.Mock).mockReturnValue({
            errorJoinGame: testError,
            successJoinGame: null,
            setErrorJoinGame: mockSetErrorJoinGame,
            setSuccessJoinGame: mockSetSuccessJoinGame
        });

        render(<JoinRoomAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardError');
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should display success alert when successJoinGame is set', () => {
        const testSuccess = 'Successfully joined game room';
        (useGame as jest.Mock).mockReturnValue({
            errorJoinGame: null,
            successJoinGame: testSuccess,
            setErrorJoinGame: mockSetErrorJoinGame,
            setSuccessJoinGame: mockSetSuccessJoinGame
        });

        render(<JoinRoomAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });

    it('should prioritize error over success if both are present', () => {
        const testError = 'Error joining room';
        const testSuccess = 'Successfully joined room';
        (useGame as jest.Mock).mockReturnValue({
            errorJoinGame: testError,
            successJoinGame: testSuccess,
            setErrorJoinGame: mockSetErrorJoinGame,
            setSuccessJoinGame: mockSetSuccessJoinGame
        });

        render(<JoinRoomAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
        expect(screen.queryByText(testSuccess)).not.toBeInTheDocument();
    });

    it('should call both setters with null when close button is clicked', () => {
        const testError = 'Test error';
        (useGame as jest.Mock).mockReturnValue({
            errorJoinGame: testError,
            successJoinGame: null,
            setErrorJoinGame: mockSetErrorJoinGame,
            setSuccessJoinGame: mockSetSuccessJoinGame
        });

        render(<JoinRoomAlertBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorJoinGame).toHaveBeenCalledWith(null);
        expect(mockSetSuccessJoinGame).toHaveBeenCalledWith(null);
    });

    it('should update alert when error state changes', () => {
        const { rerender } = render(<JoinRoomAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testError = 'New error message';
        (useGame as jest.Mock).mockReturnValue({
            errorJoinGame: testError,
            successJoinGame: null,
            setErrorJoinGame: mockSetErrorJoinGame,
            setSuccessJoinGame: mockSetSuccessJoinGame
        });

        rerender(<JoinRoomAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should update alert when success state changes', () => {
        const { rerender } = render(<JoinRoomAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testSuccess = 'New success message';
        (useGame as jest.Mock).mockReturnValue({
            errorJoinGame: null,
            successJoinGame: testSuccess,
            setErrorJoinGame: mockSetErrorJoinGame,
            setSuccessJoinGame: mockSetSuccessJoinGame
        });

        rerender(<JoinRoomAlertBadge />);
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });
});