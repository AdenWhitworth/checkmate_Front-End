import React from 'react';
import './Welcome.css';
import Button from '../../../Button/Button';
import pawn_logo from "../../../../Images/Pawn Logo.svg";
import play_logo from '../../../../Images/play-black.svg';

export default function LandingSelections(): JSX.Element {
    return (
        <div className="welcome">
            <div className="play">
                <img className="pawn-logo" src={pawn_logo}></img>
                <Button className='fixed-width-icon-button' styleType='primary' imgSrc={play_logo} imgAlt='Play Logo'>Play Friends</Button>
            </div>
        </div>          
    );
}