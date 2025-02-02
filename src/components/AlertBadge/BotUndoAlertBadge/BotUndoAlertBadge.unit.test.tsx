import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BotUndoAlertBadge from './BotUndoAlertBadge';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

jest.mock('../../../Providers/BotProvider/BotProvider', () => ({
    useBot: jest.fn()
}));

describe('BotUndoAlertBadge Component', () => {
    const mockSetErrorUndo = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useBot as jest.Mock).mockReturnValue({
            errorUndo: null,
            setErrorUndo: mockSetErrorUndo
        });
    });

    it('should not display alert when errorUndo is null', () => {
        render(<BotUndoAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display alert when errorUndo is set', () => {
        const testError = 'Test error message';
        (useBot as jest.Mock).mockReturnValue({
            errorUndo: testError,
            setErrorUndo: mockSetErrorUndo
        });

        render(<BotUndoAlertBadge />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should call setErrorUndo with null when close button is clicked', () => {
        const testError = 'Test error message';
        (useBot as jest.Mock).mockReturnValue({
            errorUndo: testError,
            setErrorUndo: mockSetErrorUndo
        });

        render(<BotUndoAlertBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorUndo).toHaveBeenCalledWith(null);
    });

    it('should update alert when errorUndo changes', () => {
        const { rerender } = render(<BotUndoAlertBadge />);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        (useBot as jest.Mock).mockReturnValue({
            errorUndo: 'New error message',
            setErrorUndo: mockSetErrorUndo
        });

        rerender(<BotUndoAlertBadge />);
        expect(screen.getByText('New error message')).toBeInTheDocument();
    });

    it('should have error severity when displaying error message', () => {
        const testError = 'Invalid undo message';
        (useBot as jest.Mock).mockReturnValue({
            errorUndo: testError,
            setErrorUndo: mockSetErrorUndo
        });

        render(<BotUndoAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardError');
    });
});