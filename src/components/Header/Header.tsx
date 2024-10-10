import React from 'react';
import './Header.css';
import { HeaderProps } from './HeaderTypes';
import Button from '../Button/Button';
import king_logo_white from "../../Images/King Logo White.svg";
import bell from "../../Images/Bell.svg";
import flag from "../../Images/Flag.svg";
import arrow_left from "../../Images/Arrow Left.svg";
import Badge from '@mui/material/Badge';

export default function Header({
    
}: HeaderProps): JSX.Element {

    return (
        <header className="header">
            <div className='menu'>
                <div className="nav-img">
                    <img className="king-logo" src={king_logo_white} alt='King main logo'></img>
                </div>
                <nav className="nav-links">
                    <li><Button className='fixed-width-button' styleType='primary'>Sign Up</Button></li>
                    <li><Button className='fixed-width-button' styleType='secondary'>Log In</Button></li>
                    <li><Button className='fixed-width-button' styleType='secondary'>Log Out</Button></li>
                    <li><Badge className='notification' badgeContent={1} color="primary"><img src={bell}></img></Badge></li>
                    <li><img className='exit-arrow' src={arrow_left}></img></li>
                    <li><img className='end-game-flag' src={flag}></img></li>
                </nav>
            </div>
        </header>
    );
}