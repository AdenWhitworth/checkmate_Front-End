import React from 'react';
import { render, screen } from '@testing-library/react';
import LandingSelections from './LandingSelections';

// Mock the child components
jest.mock('./GlobalStats/GlobalStats', () => () => <div>Global Stats Component</div>);
jest.mock('./Welcome/Welcome', () => () => <div>Welcome Component</div>);
jest.mock('./LeaderBoard/LeaderBoard', () => () => <div>Leader Board Component</div>);

describe('LandingSelections Component', () => {
    it('renders the GlobalStats, Welcome, and LeaderBoard components', () => {
        render(<LandingSelections />);
        
        expect(screen.getByText(/global stats component/i)).toBeInTheDocument();
        expect(screen.getByText(/welcome component/i)).toBeInTheDocument();
        expect(screen.getByText(/leader board component/i)).toBeInTheDocument();
    });
}); 