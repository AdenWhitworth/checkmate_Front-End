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

export default function Header(): JSX.Element {

    const {currentUser, logout, loadingAuth, setIsLoginSelected } = useAuth();
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        logout();
    }

    const handleLoginClick = () => {
        setIsLoginSelected(true);
        navigate('/auth', {
            replace: true,
        });
    }

    const handleSignupClick = () => {
        setIsLoginSelected(false);
        navigate('/auth', {
            replace: true,
        });
    }

    return (
        <header className="header">
            <div className='menu'>
                <div className="nav-img">
                    <img className="king-logo" src={king_logo_white} alt='King main logo'></img>
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
                    {currentUser && <li><Badge className='notification' badgeContent={1} color="primary"><img src={bell}></img></Badge></li>}
                    {currentUser && <li><img className='exit-arrow' src={arrow_left}></img></li>}
                    {currentUser && <li><img className='end-game-flag' src={flag}></img></li>}
                </nav>
            </div>
        </header>
    );
}