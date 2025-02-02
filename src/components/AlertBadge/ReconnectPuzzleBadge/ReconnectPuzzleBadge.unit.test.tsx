import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReconnectPuzzleBadge from './ReconnectPuzzleBadge';
import { usePuzzle } from '../../../Providers/PuzzleProvider/PuzzleProvider';

jest.mock('../../../Providers/PuzzleProvider/PuzzleProvider', () => ({
    usePuzzle: jest.fn()
}));

describe('ReconnectPuzzleBadge Component', () => {
    const mockSetReconnectPuzzle = jest.fn();
    const mockPuzzleData = {
        puzzleTag: '12345'
    };
    const mockDifficulty = 'intermediate';

    beforeEach(() => {
        jest.clearAllMocks();
        
        (usePuzzle as jest.Mock).mockReturnValue({
            reconnectPuzzle: false,
            setReconnectPuzzle: mockSetReconnectPuzzle,
            difficulty: mockDifficulty,
            puzzle: mockPuzzleData
        });
    });

    it('should not display alert when reconnectPuzzle is false', () => {
        render(<ReconnectPuzzleBadge />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should display success alert when reconnectPuzzle is true', () => {
        (usePuzzle as jest.Mock).mockReturnValue({
            reconnectPuzzle: true,
            setReconnectPuzzle: mockSetReconnectPuzzle,
            difficulty: mockDifficulty,
            puzzle: mockPuzzleData
        });

        render(<ReconnectPuzzleBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
        expect(screen.getByText(`Successfully reconnected to the active ${mockDifficulty} puzzle #${mockPuzzleData.puzzleTag}.`)).toBeInTheDocument();
    });

    it('should call setReconnectPuzzle with false when close button is clicked', () => {
        (usePuzzle as jest.Mock).mockReturnValue({
            reconnectPuzzle: true,
            setReconnectPuzzle: mockSetReconnectPuzzle,
            difficulty: mockDifficulty,
            puzzle: mockPuzzleData
        });

        render(<ReconnectPuzzleBadge />);
        
        const closeButton = screen.getByRole('button');
        fireEvent.click(closeButton);

        expect(mockSetReconnectPuzzle).toHaveBeenCalledWith(false);
    });

    it('should update alert when reconnectPuzzle changes', () => {
        const { rerender } = render(<ReconnectPuzzleBadge />);

        expect(screen.queryByRole('alert')).not.toBeInTheDocument();

        (usePuzzle as jest.Mock).mockReturnValue({
            reconnectPuzzle: true,
            setReconnectPuzzle: mockSetReconnectPuzzle,
            difficulty: mockDifficulty,
            puzzle: mockPuzzleData
        });

        rerender(<ReconnectPuzzleBadge />);
        expect(screen.getByText(`Successfully reconnected to the active ${mockDifficulty} puzzle #${mockPuzzleData.puzzleTag}.`)).toBeInTheDocument();
    });

    it('should update alert text when difficulty or puzzle changes', () => {
        const newDifficulty = 'advanced';
        const newPuzzleData = { puzzleTag: '67890' };

        (usePuzzle as jest.Mock).mockReturnValue({
            reconnectPuzzle: true,
            setReconnectPuzzle: mockSetReconnectPuzzle,
            difficulty: newDifficulty,
            puzzle: newPuzzleData
        });

        const { rerender } = render(<ReconnectPuzzleBadge />);
        expect(screen.getByText(`Successfully reconnected to the active ${newDifficulty} puzzle #${newPuzzleData.puzzleTag}.`)).toBeInTheDocument();

        // Test with different difficulty and puzzle
        (usePuzzle as jest.Mock).mockReturnValue({
            reconnectPuzzle: true,
            setReconnectPuzzle: mockSetReconnectPuzzle,
            difficulty: 'beginner',
            puzzle: { puzzleTag: '11111' }
        });

        rerender(<ReconnectPuzzleBadge />);
        expect(screen.getByText('Successfully reconnected to the active beginner puzzle #11111.')).toBeInTheDocument();
    });

    it('should have success severity when displaying reconnect message', () => {
        (usePuzzle as jest.Mock).mockReturnValue({
            reconnectPuzzle: true,
            setReconnectPuzzle: mockSetReconnectPuzzle,
            difficulty: mockDifficulty,
            puzzle: mockPuzzleData
        });

        render(<ReconnectPuzzleBadge />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('MuiAlert-standardSuccess');
    });
});