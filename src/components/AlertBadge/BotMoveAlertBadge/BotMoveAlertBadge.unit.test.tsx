import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotMoveAlertBadge from './BotMoveAlertBadge';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

// Mock the BotProvider hook
jest.mock('../../../Providers/BotProvider/BotProvider', () => ({
    useBot: jest.fn()
}));

describe('BotMoveAlertBadge Component', () => {
    // Mock implementation of setErrorMove
    const mockSetErrorMove = jest.fn();

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        
        // Default mock implementation
        (useBot as jest.Mock).mockReturnValue({
            errorMove: null,
            setErrorMove: mockSetErrorMove
        });
    });

    it('should not display alert when errorMove is null', () => {
        render(<BotMoveAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display alert when errorMove is set', () => {
        const testError = 'Invalid move message';
        (useBot as jest.Mock).mockReturnValue({
            errorMove: testError,
            setErrorMove: mockSetErrorMove
        });

        render(<BotMoveAlertBadge />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should call setErrorMove with null when close button is clicked', () => {
        const testError = 'Invalid move message';
        (useBot as jest.Mock).mockReturnValue({
            errorMove: testError,
            setErrorMove: mockSetErrorMove
        });

        render(<BotMoveAlertBadge />);
        
        // Find and click the close button
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorMove).toHaveBeenCalledWith(null);
    });

    it('should update alert when errorMove changes', () => {
        const { rerender } = render(<BotMoveAlertBadge />);
        
        // Initially no alert
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        // Update with error
        (useBot as jest.Mock).mockReturnValue({
            errorMove: 'New move error',
            setErrorMove: mockSetErrorMove
        });

        rerender(<BotMoveAlertBadge />);
        expect(screen.getByText('New move error')).toBeInTheDocument();
    });

    it('should have error severity when displaying error message', () => {
        const testError = 'Invalid move message';
        (useBot as jest.Mock).mockReturnValue({
            errorMove: testError,
            setErrorMove: mockSetErrorMove
        });

        render(<BotMoveAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardError');
    });
});