import React from 'react';
import Button from '../../Button/Button';
import bell from "../../../Images/Bell.svg";
import flag from "../../../Images/Flag.svg";
import arrow_left from "../../../Images/Arrow Left.svg";
import Badge from '@mui/material/Badge';
import { useAuth } from '../../../Providers/AuthProvider/AuthProvider';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import { usePlayer } from '../../../Providers/PlayerProvider/PlayerProvider';
import { useNavigation } from '../../../Hooks/useNavigation/useNavigation';

/**
 * HeaderLinks component displays navigation links and buttons for user interactions
 * based on their authentication and game state.
 * 
 * @component
 * @returns {JSX.Element} The rendered HeaderLinks component.
 */

export default function HeaderLinks(): JSX.Element {
    const { 
        handleArrowClick, 
        handleBadgeClick, 
        handleFlagClick, 
        handleLoginClick, 
        handleLogoutClick, 
        handleSignupClick, 
        isMenuOpen 
    } = useNavigation();
    const { currentUser, loadingAuth } = useAuth();
    const { room } = useGame();
    const { invitesCount } = usePlayer();

    const isGameActive = currentUser && room;
    const isGameFull = isGameActive && room.players.length >= 2;

    const renderAuthButtons = () => (
        <>
            {!currentUser && (
                <>
                    <li><Button className='fixed-width-button' styleType='primary' onClick={handleSignupClick}>Sign Up</Button></li>
                    <li><Button className='fixed-width-button' styleType='secondary' onClick={handleLoginClick}>Log In</Button></li>
                </>
            )}
        </>
    );

    const renderLoggedOutButtons = () => (
        isGameActive! && (
            <>
                <li>
                    <Button 
                        className='fixed-width-button' 
                        disabled={loadingAuth} 
                        styleType='secondary' 
                        onClick={handleLogoutClick}
                    >
                        {loadingAuth ? 'Logging out...' : 'Log out'}
                    </Button>
                </li>
                <li>
                    <Badge 
                        onClick={handleBadgeClick} 
                        className='notification' 
                        badgeContent={invitesCount} 
                        color="primary"
                    >
                        <img src={bell} alt="Notifications" />
                    </Badge>
                </li>
            </>
        )
    );

    const renderInGameButtons = () => (
        <>
            {!isGameFull &&
                <li>
                    <img 
                        className='exit-arrow' 
                        onClick={handleArrowClick} 
                        src={arrow_left} 
                        alt="Exit Game" 
                    />
                </li>
            }

            {isGameFull && 
                <li>
                    <img 
                        className='end-game-flag' 
                        onClick={handleFlagClick} 
                        src={flag} 
                        alt="End Game" 
                    />
                </li>
            }
        </>
    );

    return (
        <nav className={`nav-links ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul>
                {renderAuthButtons()}
                {renderLoggedOutButtons()}
                {renderInGameButtons()}
            </ul>
        </nav>
    );
}