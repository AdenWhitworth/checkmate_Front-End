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
        handleKingClick, 
    } = useNavigation();

    return (
        <>
            <header className="header">
                <div className='menu'>
                    <div className="nav-img">
                        <img className="king-logo" onClick={handleKingClick} src={king_logo_white} alt='King main logo'></img>
                    </div>

                    <HamburgerMenu />

                    <HeaderLinks />
                </div>
            </header>
        </>
    );
}