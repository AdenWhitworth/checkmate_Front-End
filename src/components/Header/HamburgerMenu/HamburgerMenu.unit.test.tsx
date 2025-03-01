import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HamburgerMenu from './HamburgerMenu';

describe('HamburgerMenu', () => {
    const mockToggleMenu = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<HamburgerMenu toggleMenu={mockToggleMenu} isMenuOpen={false} />);
        expect(screen.getByTestId("hamburger-menu")).toBeInTheDocument();
    });

    it('calls toggleMenu when clicked', () => {
        render(<HamburgerMenu toggleMenu={mockToggleMenu} isMenuOpen={false} />);
        
        const menu = screen.getByTestId("hamburger-menu")
        fireEvent.click(menu);
        
        expect(mockToggleMenu).toHaveBeenCalledTimes(1);
    });

    it('applies "open" class to bars when menu is open', () => {
        render(<HamburgerMenu toggleMenu={mockToggleMenu} isMenuOpen={true} />);
        
        const bars = screen.getAllByTestId('bar');
        bars.forEach(bar => {
            expect(bar).toHaveClass('open');
        });
    });

    it('does not apply "open" class to bars when menu is closed', () => {
        render(<HamburgerMenu toggleMenu={mockToggleMenu} isMenuOpen={false} />);
        
        const bars = screen.getAllByTestId('bar');
        bars.forEach(bar => {
            expect(bar).not.toHaveClass('open');
        });
    });
});