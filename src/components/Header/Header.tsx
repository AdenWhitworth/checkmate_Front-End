import React from 'react';
import './Header.css';
import Button from '../Button/Button';
import king_logo_white from "../../Images/King Logo White.svg";
import bell from "../../Images/Bell.svg";
import flag from "../../Images/Flag.svg";
import arrow_left from "../../Images/Arrow Left.svg";
import Badge from '@mui/material/Badge';
import { useAuth } from '../../Providers/AuthProvider/AuthProvider';
import { useGame } from '../../Providers/GameProvider/GameProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { useNavigation } from '../../Hooks/useNavigation/useNavigation';

export default function Header(): JSX.Element {

    const {currentUser, loadingAuth } = useAuth();
    const { room } = useGame();
    const { invitesCount } = usePlayer();
    const { handleArrowClick, handleBadgeClick, handleFlagClick, handleKingClick, handleLoginClick, handleLogoutClick, handleSignupClick } = useNavigation();

    return (
        <>
            <header className="header">
                <div className='menu'>
                    <div className="nav-img">
                        <img className="king-logo" onClick={handleKingClick} src={king_logo_white} alt='King main logo'></img>
                    </div>
                    <nav className="nav-links">
                        {!currentUser && <li><Button className='fixed-width-button' styleType='primary' onClick={handleSignupClick}>Sign Up</Button></li>}
                        {!currentUser && <li><Button className='fixed-width-button' styleType='secondary' onClick={handleLoginClick}>Log In</Button></li>}
                        {currentUser && 
                            <li>
                                <Button className='fixed-width-button' disabled={loadingAuth} styleType='secondary' onClick={handleLogoutClick}>
                                    {loadingAuth ? 'Logging out...' : 'Log out'}
                                </Button>
                            </li>
                        }
                        {currentUser && !room && <li><Badge onClick={handleBadgeClick} className='notification' badgeContent={invitesCount} color="primary"><img src={bell}></img></Badge></li>}
                        {currentUser && room && room.players.length < 2 && <li><img className='exit-arrow' onClick={handleArrowClick} src={arrow_left}></img></li>}
                        {currentUser && room && room.players.length >= 2 && <li><img className='end-game-flag' onClick={handleFlagClick} src={flag}></img></li>}
                    </nav>
                </div>
            </header>
        </>
    );
}