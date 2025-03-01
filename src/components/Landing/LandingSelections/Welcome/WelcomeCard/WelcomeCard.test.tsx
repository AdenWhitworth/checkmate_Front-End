import React from 'react';
import { render, screen } from '@testing-library/react';
import WelcomeCard from './WelcomeCard';

// Mock the props for the WelcomeCard component
const mockProps = {
    imgSrc: 'path/to/image.png',
    title: 'Welcome Title',
    text: 'This is a description of the welcome card.',
    onClick: jest.fn(),
};

describe('WelcomeCard Component', () => {
    it('renders the welcome card with correct content', () => {
        render(<WelcomeCard {...mockProps} />);
        
        expect(screen.getByAltText(/card icon/i)).toBeInTheDocument(); // Check if image is rendered
        expect(screen.getByText(/welcome title/i)).toBeInTheDocument(); // Check if title is rendered
        expect(screen.getByText(/this is a description of the welcome card/i)).toBeInTheDocument(); // Check if text is rendered
    });

    it('calls onClick function when card is clicked', () => {
        render(<WelcomeCard {...mockProps} />);
        
        const card = screen.getByTestId('welcome-card');
        card.click();
        
        expect(mockProps.onClick).toHaveBeenCalled(); // Check if onClick is called
    });
}); 