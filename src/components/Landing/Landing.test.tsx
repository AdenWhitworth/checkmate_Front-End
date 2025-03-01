import React from 'react';
import { render, screen } from '@testing-library/react';
import Landing from './Landing';

// Mock the child components
jest.mock('../Header/Header', () => () => <div>Header Component</div>);
jest.mock('./LandingSelections/LandingSelections', () => () => <div>Landing Selections Component</div>);

describe('Landing Component', () => {
    it('renders the Header and LandingSelections components', () => {
        render(<Landing />);
        
        expect(screen.getByText(/header component/i)).toBeInTheDocument();
        expect(screen.getByText(/landing selections component/i)).toBeInTheDocument();
    });
}); 