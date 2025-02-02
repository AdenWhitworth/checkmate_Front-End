import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CreatePuzzleAlertBadge from './CreatePuzzleAlertBadge';
import { usePuzzle } from '../../../Providers/PuzzleProvider/PuzzleProvider';

jest.mock('../../../Providers/PuzzleProvider/PuzzleProvider', () => ({
    usePuzzle: jest.fn()
}));

describe('CreatePuzzleAlertBadge Component', () => {
    const mockSetErrorStartPuzzle = jest.fn();
    const mockSetSuccessStartPuzzle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        
        (usePuzzle as jest.Mock).mockReturnValue({
            errorStartPuzzle: null,
            successStartPuzzle: null,
            setErrorStartPuzzle: mockSetErrorStartPuzzle,
            setSuccessStartPuzzle: mockSetSuccessStartPuzzle
        });
    });

    it('should not display alert when both error and success are null', () => {
        render(<CreatePuzzleAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display error alert when errorStartPuzzle is set', () => {
        const testError = 'Failed to start puzzle';
        (usePuzzle as jest.Mock).mockReturnValue({
            errorStartPuzzle: testError,
            successStartPuzzle: null,
            setErrorStartPuzzle: mockSetErrorStartPuzzle,
            setSuccessStartPuzzle: mockSetSuccessStartPuzzle
        });

        render(<CreatePuzzleAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardError');
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should display success alert when successStartPuzzle is set', () => {
        const testSuccess = 'Puzzle started successfully';
        (usePuzzle as jest.Mock).mockReturnValue({
            errorStartPuzzle: null,
            successStartPuzzle: testSuccess,
            setErrorStartPuzzle: mockSetErrorStartPuzzle,
            setSuccessStartPuzzle: mockSetSuccessStartPuzzle
        });

        render(<CreatePuzzleAlertBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });

    it('should prioritize error over success if both are present', () => {
        const testError = 'Error message';
        const testSuccess = 'Success message';
        (usePuzzle as jest.Mock).mockReturnValue({
            errorStartPuzzle: testError,
            successStartPuzzle: testSuccess,
            setErrorStartPuzzle: mockSetErrorStartPuzzle,
            setSuccessStartPuzzle: mockSetSuccessStartPuzzle
        });

        render(<CreatePuzzleAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
        expect(screen.queryByText(testSuccess)).not.toBeInTheDocument();
    });

    it('should call both setters with null when close button is clicked', () => {
        const testError = 'Test error';
        (usePuzzle as jest.Mock).mockReturnValue({
            errorStartPuzzle: testError,
            successStartPuzzle: null,
            setErrorStartPuzzle: mockSetErrorStartPuzzle,
            setSuccessStartPuzzle: mockSetSuccessStartPuzzle
        });

        render(<CreatePuzzleAlertBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetErrorStartPuzzle).toHaveBeenCalledWith(null);
        expect(mockSetSuccessStartPuzzle).toHaveBeenCalledWith(null);
    });

    it('should update alert when error state changes', () => {
        const { rerender } = render(<CreatePuzzleAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testError = 'New error message';
        (usePuzzle as jest.Mock).mockReturnValue({
            errorStartPuzzle: testError,
            successStartPuzzle: null,
            setErrorStartPuzzle: mockSetErrorStartPuzzle,
            setSuccessStartPuzzle: mockSetSuccessStartPuzzle
        });

        rerender(<CreatePuzzleAlertBadge />);
        expect(screen.getByText(testError)).toBeInTheDocument();
    });

    it('should update alert when success state changes', () => {
        const { rerender } = render(<CreatePuzzleAlertBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        const testSuccess = 'New success message';
        (usePuzzle as jest.Mock).mockReturnValue({
            errorStartPuzzle: null,
            successStartPuzzle: testSuccess,
            setErrorStartPuzzle: mockSetErrorStartPuzzle,
            setSuccessStartPuzzle: mockSetSuccessStartPuzzle
        });

        rerender(<CreatePuzzleAlertBadge />);
        expect(screen.getByText(testSuccess)).toBeInTheDocument();
    });
});