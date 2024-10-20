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

    const isNoActiveRoom = currentUser && !room;
    const isRoomActive = room && room.players.length > 0;
    const isGameFull = isRoomActive && room.players.length >= 2;
    const isGameNotFull = isRoomActive && room.players.length < 2;
    
    /**
     * Renders the authentication buttons (Sign Up and Log In) if no user is currently authenticated.
     * @returns {JSX.Element} The rendered JSX for the authentication buttons.
     */
    const renderAuthButtons = (): JSX.Element => (
        <>
            {!currentUser && !loadingAuth && (
                <>
                    <li><Button className='fixed-width-button' styleType='primary' onClick={handleSignupClick}>Sign Up</Button></li>
                    <li><Button className='fixed-width-button' styleType='secondary' onClick={handleLoginClick}>Log In</Button></li>
                </>
            )}
        </>
    );

    /**
     * Renders the buttons for a logged-out state, including the logout button and notifications badge.
     * @returns {JSX.Element} The rendered JSX for the logged-out buttons
     */
    const renderLoggedOutButtons = (): JSX.Element => (
        <>
            {isNoActiveRoom && (
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
            )}
        </>
    );

    /**
     * Renders the in-game buttons based on the game state, including the exit game arrow and end game flag.
     * 
     * @function renderInGameButtons
     * @returns {JSX.Element} The rendered JSX for the in-game buttons.
     */
    const renderInGameButtons = (): JSX.Element => (
        <>
            {isGameNotFull &&
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