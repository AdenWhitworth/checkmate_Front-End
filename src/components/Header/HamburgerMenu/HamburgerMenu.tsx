import React from 'react';
import { useNavigation } from '../../../Hooks/useNavigation/useNavigation';

/**
 * HamburgerMenu component provides a clickable menu icon for toggling navigation visibility.
 * It uses three bars that change their style based on whether the menu is open or closed.
 * 
 * @component
 * @returns {JSX.Element} The rendered HamburgerMenu component.
 */
export default function HamburgerMenu(): JSX.Element {
    const {
        toggleMenu, 
        isMenuOpen 
    } = useNavigation();

    return(
        <div className="hamburger-menu" onClick={toggleMenu}>
            <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
            <span className={`bar ${isMenuOpen ? 'open' : ''}`}></span>
        </div>
    );
}