import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreateBotGameAlertBadge from './CreateBotGameAlertBadge';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

jest.mock('../../../Providers/BotProvider/BotProvider', () => ({
    useBot: jest.fn()
}));

describe('CreateBotGameAlertBadge Component', () => {
    const mockSetErrorCreateGame = jest.fn();
    const mockSetSuccessCreateGame = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useBot as jest.Mock).mockReturnValue({
            errorCreateGame: null,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });
    });

    it('should not display alert when both error and success are null', () => {
        render(<CreateBotGameAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display error alert when errorCreateGame is set', () => {
        const testError = 'Failed to create bot game';
        (useBot as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateBotGameAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardError');
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should display success alert when successCreateGame is set', () => {
        const testSuccess = 'Bot game created successfully';
        (useBot as jest.Mock).mockReturnValue({
            errorCreateGame: null,
            successCreateGame: testSuccess,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateBotGameAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });

    it('should prioritize error over success if both are present', () => {
        const testError = 'Error message';
        const testSuccess = 'Success message';
        (useBot as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: testSuccess,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateBotGameAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
        expect(screen.queryByText(testSuccess)).not.toBeInTheDocument();
    });

    it('should call both setters with null when close button is clicked', () => {
        const testError = 'Test error';
        (useBot as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        render(<CreateBotGameAlertBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorCreateGame).toHaveBeenCalledWith(null);
        expect(mockSetSuccessCreateGame).toHaveBeenCalledWith(null);
    });

    it('should update alert when error state changes', () => {
        const { rerender } = render(<CreateBotGameAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testError = 'New error message';
        (useBot as jest.Mock).mockReturnValue({
            errorCreateGame: testError,
            successCreateGame: null,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        rerender(<CreateBotGameAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should update alert when success state changes', () => {
        const { rerender } = render(<CreateBotGameAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testSuccess = 'New success message';
        (useBot as jest.Mock).mockReturnValue({
            errorCreateGame: null,
            successCreateGame: testSuccess,
            setErrorCreateGame: mockSetErrorCreateGame,
            setSuccessCreateGame: mockSetSuccessCreateGame
        });

        rerender(<CreateBotGameAlertBadge />);
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });
});