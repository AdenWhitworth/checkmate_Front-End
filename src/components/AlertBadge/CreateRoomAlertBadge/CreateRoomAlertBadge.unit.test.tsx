import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateRoomAlertBadge from './CreateRoomAlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';

jest.mock('../../../Providers/GameProvider/GameProvider', () => ({
    useGame: jest.fn()
}));

describe('CreateRoomAlertBadge Component', () => {
    const mockSetErrorCreateGame = jest.fn();
    const mockSetSuccessCreateGame = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useGame as jest.Mock).mockReturnValue({
            errorCreateGame: null,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });
    });

    it('should not display alert when both error and success are null', () => {
        render(<CreateRoomAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display error alert when errorCreateGame is set', () => {
        const testError = 'Failed to create game room';
        (useGame as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateRoomAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardError');
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should display success alert when successCreateGame is set', () => {
        const testSuccess = 'Game room created successfully';
        (useGame as jest.Mock).mockReturnValue({
            errorCreateGame: null,
            successCreateGame: testSuccess,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateRoomAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });

    it('should prioritize error over success if both are present', () => {
        const testError = 'Error message';
        const testSuccess = 'Success message';
        (useGame as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: testSuccess,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateRoomAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
        expect(screen.queryByText(testSuccess)).not.toBeInTheDocument();
    });

    it('should call both setters with null when close button is clicked', () => {
        const testError = 'Test error';
        (useGame as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateRoomAlertBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorCreateGame).toHaveBeenCalledWith(null);
        expect(mockSetSuccessCreateGame).toHaveBeenCalledWith(null);
    });

    it('should update alert when error state changes', () => {
        const { rerender } = render(<CreateRoomAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testError = 'New error message';
        (useGame as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        rerender(<CreateRoomAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should update alert when success state changes', () => {
        const { rerender } = render(<CreateRoomAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testSuccess = 'New success message';
        (useGame as jest.Mock).mockReturnValue({
            errorCreateGame: null,
            successCreateGame: testSuccess,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        rerender(<CreateRoomAlertBadge />);
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });
});