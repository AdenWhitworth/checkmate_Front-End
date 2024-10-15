import React, { useEffect } from 'react';
import './Header.css';
import Button from '../Button/Button';
import king_logo_white from "../../Images/King Logo White.svg";
import bell from "../../Images/Bell.svg";
import flag from "../../Images/Flag.svg";
import arrow_left from "../../Images/Arrow Left.svg";
import Badge from '@mui/material/Badge';
import { useAuth } from '../../Providers/AuthProvider/AuthProvider';
import { useNavigate } from "react-router-dom";
import { useGame } from '../../Providers/GameProvider/GameProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { db } from '../../firebase';
import { collection, deleteDoc, doc} from "firebase/firestore";
import { useSocket } from '../../Providers/SocketProvider/SocketProvider';

export default function Header(): JSX.Element {

    const {currentUser, logout, loadingAuth, setIsLoginSelected } = useAuth();
    const { room, cleanup, opponent } = useGame();
    const { socketRef, sendForfeit } = useSocket();
    const { invitesCount, setLobbySelection, player } = usePlayer();
    const navigate = useNavigate();

    const handleKingClick = () => {
        navigate('/', {
            replace: true,
        });
    };

    const handleBadgeClick = () => {
        setLobbySelection(true);
        navigate('/dashboard', {
            replace: true,
        });
    };

    const handleLogoutClick = () => {
        logout();
    };

    const handleLoginClick = () => {
        setIsLoginSelected(true);
        navigate('/auth', {
            replace: true,
        });
    };

    const handleSignupClick = () => {
        setIsLoginSelected(false);
        navigate('/auth', {
            replace: true,
        });
    };
    
    const handleExitClick = () => {
        try {
            if (!opponent) throw Error("Opponent required.");

            const userCollection = collection(db, 'users');
            const DocRef = doc(userCollection, opponent.opponentUserId);
            const inviteCollection = collection(DocRef,'invites');
            const DocRef2 = doc(inviteCollection, opponent.opponentInviteId);
            deleteDoc(DocRef2);
        
            cleanup();
        } catch (error){
            console.error("Please try again");
        }    
    }

    const handleForfeit = async () => {
        if (socketRef.current && room && player) {
          try {
            const username = player.username;
            await sendForfeit({ room, username });
            cleanup();
          } catch (error) {
            console.log("Please try again.");
          }
        }
    }

    return (
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
                    {currentUser && room && room.players.length < 2 && <li><img className='exit-arrow' onClick={handleExitClick} src={arrow_left}></img></li>}
                    {currentUser && room && room.players.length >= 2 && <li><img className='end-game-flag' onClick={handleForfeit} src={flag}></img></li>}
                </nav>
            </div>
        </header>
    );
}