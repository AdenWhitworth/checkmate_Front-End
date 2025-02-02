import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MoveAlertBadge from './MoveAlertBadge';
import { useGame } from '../../../Providers/GameProvider/GameProvider';

jest.mock('../../../Providers/GameProvider/GameProvider', () => ({
    useGame: jest.fn()
}));

describe('MoveAlertBadge Component', () => {
    const mockSetErrorMove = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (useGame as jest.Mock).mockReturnValue({
            errorMove: null,
            setErrorMove: mockSetErrorMove
        });
    });

    it('should not display alert when errorMove is null', () => {
        render(<MoveAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display alert when errorMove is set', () => {
        const testError = 'Invalid move';
        (useGame as jest.Mock).mockReturnValue({
            errorMove: testError,
            setErrorMove: mockSetErrorMove
        });

        render(<MoveAlertBadge />);
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should call setErrorMove with null when close button is clicked', () => {
        const testError = 'Invalid move';
        (useGame as jest.Mock).mockReturnValue({
            errorMove: testError,
            setErrorMove: mockSetErrorMove
        });

        render(<MoveAlertBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorMove).toHaveBeenCalledWith(null);
    });

    it('should update alert when errorMove changes', () => {
        const { rerender } = render(<MoveAlertBadge />);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        (useGame as jest.Mock).mockReturnValue({
            errorMove: 'New error message',
            setErrorMove: mockSetErrorMove
        });

        rerender(<MoveAlertBadge />);
        expect(screen.getByText('New error message')).toBeInTheDocument();
    });

    it('should have error severity when displaying error message', () => {
        const testError = 'Invalid move';
        (useGame as jest.Mock).mockReturnValue({
            errorMove: testError,
            setErrorMove: mockSetErrorMove
        });

        render(<MoveAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardError');
    });
});