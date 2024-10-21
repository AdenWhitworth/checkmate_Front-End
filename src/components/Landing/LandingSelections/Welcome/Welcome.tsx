import React from 'react';
import './Welcome.css';
import Button from '../../../Button/Button';
import pawn_logo from "../../../../Images/Pawn Logo.svg";
import play_logo from '../../../../Images/play-black.svg';
import { useNavigation } from '../../../../Hooks/useNavigation/useNavigation';
import chessboard_logo from '../../../../Images/Chess Board Logo.svg';

/**
 * LandingSelections component displays a welcome section with an option to "Play Friends".
 * It features a button that navigates users to the dashboard using a custom navigation hook.
 * 
 * @component
 * @returns {JSX.Element} The rendered LandingSelections component.
 */

export default function LandingSelections(): JSX.Element {
    
    const { handleSendToDashboard } = useNavigation();
    
    return (
        <div className="welcome">
            <img className='chessboard-logo' src={chessboard_logo} alt='Chessboard logo'></img>
            <div className="play">
                <img className="pawn-logo" src={pawn_logo} alt='Pawn logo'></img>
                <Button onClick={handleSendToDashboard} className='fixed-width-icon-button' styleType='primary' imgSrc={play_logo} imgAlt='Play Logo'>Play Friends</Button>
            </div>
        </div>          
    );
}