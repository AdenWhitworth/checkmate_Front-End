import React from 'react';
import { render, screen } from '@testing-library/react';
import Welcome from './Welcome';
import { useNavigation } from '../../../../Hooks/useNavigation/useNavigation';

// Mock the useNavigation hook
jest.mock('../../../../Hooks/useNavigation/useNavigation');

// Mock the WelcomeCard component
jest.mock('./WelcomeCard/WelcomeCard', () => ({ imgSrc, title, text, onClick }: {imgSrc: string, title: string, text: string, onClick: () => void}) => (
    <div role="button" onClick={onClick}>
        <img alt="card icon" src={imgSrc} />
        <h2>{title}</h2>
        <p>{text}</p>
    </div>
));

describe('Welcome Component', () => {
    const mockHandleSendToDashboard = jest.fn();
    const mockHandleSendToBotDashboard = jest.fn();
    const mockHandleSendToPuzzleDashboard = jest.fn();

    beforeEach(() => {
        (useNavigation as jest.Mock).mockReturnValue({
            handleSendToDashboard: mockHandleSendToDashboard,
            handleSendToBotDashboard: mockHandleSendToBotDashboard,
            handleSendToPuzzleDashboard: mockHandleSendToPuzzleDashboard,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the welcome cards', () => {
        render(<Welcome />);
        
        expect(screen.getByText(/play friends/i)).toBeInTheDocument();
        expect(screen.getByText("Puzzles")).toBeInTheDocument();
        expect(screen.getByText(/play bots/i)).toBeInTheDocument();
    });

    it('calls handleSendToDashboard when "Play Friends" card is clicked', () => {
        render(<Welcome />);
        
        const playFriendsCard = screen.getByText(/play friends/i);
        playFriendsCard.click();
        
        expect(mockHandleSendToDashboard).toHaveBeenCalled();
    });

    it('calls handleSendToPuzzleDashboard when "Puzzles" card is clicked', () => {
        render(<Welcome />);
        
        const puzzlesCard = screen.getByText("Puzzles");
        puzzlesCard.click();
        
        expect(mockHandleSendToPuzzleDashboard).toHaveBeenCalled();
    });

    it('calls handleSendToBotDashboard when "Play Bots" card is clicked', () => {
        render(<Welcome />);
        
        const playBotsCard = screen.getByText(/play bots/i);
        playBotsCard.click();
        
        expect(mockHandleSendToBotDashboard).toHaveBeenCalled();
    });
}); 