import React from 'react';
import './HamburgerMenu.css';
import { HamburgerMenuProps } from './HamburgerMenuTypes';

/**
 * HamburgerMenu component provides a clickable menu icon for toggling navigation visibility.
 * It uses three bars that change their style based on whether the menu is open or closed.
 * 
 * @component
 * @returns {JSX.Element} The rendered HamburgerMenu component.
 */
export default function HamburgerMenu({
    toggleMenu, 
    isMenuOpen
}: HamburgerMenuProps): JSX.Element {
    return(
        <div className="hamburger-menu" onClick={toggleMenu} data-testid="hamburger-menu">
            <span className={isMenuOpen? "bar open": "bar"} data-testid="bar"  ></span>
            <span className={isMenuOpen? "bar open": "bar"} data-testid="bar"></span>
            <span className={isMenuOpen? "bar open": "bar"} data-testid="bar"></span>
        </div>
    );
}