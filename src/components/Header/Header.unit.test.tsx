import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { useNavigation } from '../../Hooks/useNavigation/useNavigation';

// Mock the useNavigation hook
jest.mock('../../Hooks/useNavigation/useNavigation');

// Mock the HeaderLinks and HamburgerMenu components
jest.mock('./HeaderLinks/HeaderLinks', () => () => <div data-testid="header-links" />);
jest.mock('./HamburgerMenu/HamburgerMenu', () => {
    return ({ toggleMenu }: { toggleMenu: () => void }) => (
        <button data-testid="hamburger-menu" onClick={toggleMenu} />
    );
});

describe('Header', () => {
    const mockHandleArrowClick = jest.fn();
    const mockHandleBadgeClick = jest.fn();
    const mockHandleFlagClick = jest.fn();
    const mockHandleLoginClick = jest.fn();
    const mockHandleLogoutClick = jest.fn();
    const mockHandleSignupClick = jest.fn();
    const mockHandleProfileClick = jest.fn();
    const mockHandleBotFlagClick = jest.fn();
    const mockHandleKingClick = jest.fn();
    const mockToggleMenu = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({
            handleArrowClick: mockHandleArrowClick,
            handleBadgeClick: mockHandleBadgeClick,
            handleFlagClick: mockHandleFlagClick,
            handleLoginClick: mockHandleLoginClick,
            handleLogoutClick: mockHandleLogoutClick,
            handleSignupClick: mockHandleSignupClick,
            handleProfileClick: mockHandleProfileClick,
            handleBotFlagClick: mockHandleBotFlagClick,
            isMenuOpen: false,
            toggleMenu: mockToggleMenu,
            handleKingClick: mockHandleKingClick,
        });
    });

    it('renders the header with logo and menu', () => {
        render(<Header />);

        expect(screen.getByAltText('King main logo')).toBeInTheDocument();
        expect(screen.getByTestId('hamburger-menu')).toBeInTheDocument(); // Check for the mocked hamburger menu
        expect(screen.getByTestId('header-links')).toBeInTheDocument(); // Check for the mocked HeaderLinks
    });

    it('calls handleKingClick when the logo is clicked', () => {
        render(<Header />);

        fireEvent.click(screen.getByAltText('King main logo'));
        expect(mockHandleKingClick).toHaveBeenCalled();
    });

    it('calls toggleMenu when the hamburger menu is clicked', () => {
        render(<Header />);

        fireEvent.click(screen.getByTestId('hamburger-menu')); // Check for the mocked hamburger menu
        expect(mockToggleMenu).toHaveBeenCalled();
    });
});
