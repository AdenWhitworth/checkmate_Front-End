import React from 'react';
import './Header.css';
import king_logo_white from "../../Images/King Logo White.svg";
import { useNavigation } from '../../Hooks/useNavigation/useNavigation';
import HamburgerMenu from './HamburgerMenu/HamburgerMenu';
import HeaderLinks from './HeaderLinks/HeaderLinks';

/**
 * Header component renders the main header of the application, including a logo, a hamburger menu, and navigation links.
 * 
 * @component
 * @returns {JSX.Element} The rendered Header component.
 */
export default function Header(): JSX.Element {
    const { 
        handleArrowClick, 
        handleBadgeClick, 
        handleFlagClick, 
        handleLoginClick, 
        handleLogoutClick, 
        handleSignupClick, 
        isMenuOpen,
        toggleMenu,
        handleKingClick
    } = useNavigation();

    return (
        <>
            <header className="header">
                <div className='menu'>
                    <div className="nav-img">
                        <img className="king-logo" onClick={handleKingClick} src={king_logo_white} alt='King main logo'></img>
                    </div>

                    <HamburgerMenu toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />

                    <HeaderLinks 
                        handleArrowClick={handleArrowClick}
                        handleBadgeClick={handleBadgeClick}
                        handleFlagClick={handleFlagClick}
                        handleLoginClick={handleLoginClick}
                        handleLogoutClick={handleLogoutClick}
                        handleSignupClick={handleSignupClick}
                        isMenuOpen={isMenuOpen}
                    />
                </div>
            </header>
        </>
    );
}