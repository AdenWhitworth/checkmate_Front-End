import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotHintAlertBadge from './BotHintAlertBadge';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

jest.mock('../../../Providers/BotProvider/BotProvider', () => ({
    useBot: jest.fn()
}));

describe('BotHintAlertBadge Component', () => {
    const mockSetErrorHint = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useBot as jest.Mock).mockReturnValue({
            errorHint: null,
            setErrorHint: mockSetErrorHint
        });
    });

    it('should not display alert when errorHint is null', () => {
        render(<BotHintAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display alert when errorHint is set', () => {
        const testError = 'Test error message';
        (useBot as jest.Mock).mockReturnValue({
            errorHint: testError,
            setErrorHint: mockSetErrorHint
        });

        render(<BotHintAlertBadge />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should call setErrorHint with null when close button is clicked', () => {
        const testError = 'Test error message';
        (useBot as jest.Mock).mockReturnValue({
            errorHint: testError,
            setErrorHint: mockSetErrorHint
        });

        render(<BotHintAlertBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorHint).toHaveBeenCalledWith(null);
    });

    it('should update alert when errorHint changes', () => {
        const { rerender } = render(<BotHintAlertBadge />);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        (useBot as jest.Mock).mockReturnValue({
            errorHint: 'New error message',
            setErrorHint: mockSetErrorHint
        });

        rerender(<BotHintAlertBadge />);
        expect(screen.getByText('New error message')).toBeInTheDocument();
    });

    it('should have error severity when displaying error message', () => {
        const testError = 'Invalid move message';
        (useBot as jest.Mock).mockReturnValue({
            errorHint: testError,
            setErrorHint: mockSetErrorHint
        });

        render(<BotHintAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardError');
    });
});