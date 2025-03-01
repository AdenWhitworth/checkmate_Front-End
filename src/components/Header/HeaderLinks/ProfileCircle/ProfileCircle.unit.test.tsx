import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfileCircle from './ProfileCircle';
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';

// Mock the usePlayer hook
jest.mock('../../../../Providers/PlayerProvider/PlayerProvider');

describe('ProfileCircle', () => {
    const mockOnClick = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default background color when playerStatic is not provided', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            playerStatic: null
        });

        render(<ProfileCircle onClick={mockOnClick} />);
        
        const profileCircle = screen.getByTestId("profile-circle");
        expect(profileCircle).toBeInTheDocument();
        expect(profileCircle).toHaveTextContent("");
        expect(profileCircle).toHaveStyle('background-color: #ccc');
    });

    it('renders initials correctly for a single-word username', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            playerStatic: { username: 'Alice' }
        });

        render(<ProfileCircle onClick={mockOnClick} />);
        
        const profileCircle = screen.getByTestId("profile-circle");
        expect(profileCircle).toBeInTheDocument();
        expect(profileCircle).toHaveTextContent("AL");
        expect(profileCircle).toHaveStyle('background-color: rgb(82, 82, 82)'); // Adjust based on the hash function
    });

    it('renders initials correctly for a multi-word username', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            playerStatic: { username: 'Alice Wonderland' }
        });

        render(<ProfileCircle onClick={mockOnClick} />);
        
        const profileCircle = screen.getByTestId("profile-circle");
        expect(profileCircle).toBeInTheDocument();
        expect(profileCircle).toHaveTextContent("AW");
        expect(profileCircle).toHaveStyle('background-color: rgb(82, 82, 82)'); // Adjust based on the hash function
    });

    it('renders initials correctly when username has non-alphanumeric characters', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            playerStatic: { username: 'Alice@Wonderland!' }
        });

        render(<ProfileCircle onClick={mockOnClick} />);
        
        const profileCircle = screen.getByTestId("profile-circle");
        expect(profileCircle).toBeInTheDocument();
        expect(profileCircle).toHaveTextContent("AW");
    });

    it('calls onClick when the profile circle is clicked', () => {
        (usePlayer as jest.Mock).mockReturnValue({
            playerStatic: { username: 'Alice' }
        });

        render(<ProfileCircle onClick={mockOnClick} />);
        
        const profileCircle = screen.getByTestId("profile-circle");
        expect(profileCircle).toBeInTheDocument();
        expect(profileCircle).toHaveTextContent("AL");
        fireEvent.click(profileCircle);
        
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});