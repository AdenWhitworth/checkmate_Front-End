import React from 'react';
import './Welcome.css';
import { useNavigation } from '../../../../Hooks/useNavigation/useNavigation';
import handshake from "../../../../Images/handshake yellow.svg";
import puzzle from "../../../../Images/puzzle piece yellow.svg";
import bot from "../../../../Images/bot yellow.svg";
import WelcomeCard from './WelcomeCard/WelcomeCard';

/**
 * A React functional component that serves as a welcome screen,
 * providing navigation options to different parts of the application.
 *
 * The component displays three cards:
 * - "Play Friends": Navigate to start a game against a friend.
 * - "Puzzles": Access a collection of training puzzles.
 * - "Play Bots": Practice games against AI bots.
 *
 * @component
 * @returns {JSX.Element} A JSX element representing the welcome screen.
 */
export default function Welcome(): JSX.Element {
    
    const { handleSendToDashboard } = useNavigation();
    
    return (
        <div className="welcome">
            <WelcomeCard 
                imgSrc={handshake} 
                title='Play Friends' 
                text='Start a game against a friend'
                onClick={handleSendToDashboard}
            ></WelcomeCard>

            <WelcomeCard 
                imgSrc={puzzle} 
                title='Puzzles' 
                text='Train with more than 500,000 puzzles'
                onClick={() => console.log("Puzzles")}
            ></WelcomeCard>

            <WelcomeCard
                imgSrc={bot} 
                title='Play Bots' 
                text='Practice versus selectable training bots'
                onClick={() => console.log("Bots")}
            ></WelcomeCard>
        </div>          
    );
}