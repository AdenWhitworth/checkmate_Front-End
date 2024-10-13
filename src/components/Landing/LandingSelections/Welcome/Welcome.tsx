import React from 'react';
import './Welcome.css';
import Button from '../../../Button/Button';
import pawn_logo from "../../../../Images/Pawn Logo.svg";
import play_logo from '../../../../Images/play-black.svg';
import { useNavigate } from "react-router-dom";

export default function LandingSelections(): JSX.Element {
    
    const navigate = useNavigate();

    const HandleDashboardClick = () => {
        navigate('/dashboard', {
            replace: true,
        });
    }
    
    return (
        <div className="welcome">
            <div className="play">
                <img className="pawn-logo" src={pawn_logo}></img>
                <Button onClick={HandleDashboardClick} className='fixed-width-icon-button' styleType='primary' imgSrc={play_logo} imgAlt='Play Logo'>Play Friends</Button>
            </div>
        </div>          
    );
}