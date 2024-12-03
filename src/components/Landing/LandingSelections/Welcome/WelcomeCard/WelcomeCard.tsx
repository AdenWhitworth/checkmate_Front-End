import React from 'react';
import { WelcomeCardProps } from './WelcomCardTypes';

/**
 * A React functional component representing a card on the welcome screen.
 * Each card displays an icon, a title, a description, and is clickable to
 * perform an action.
 *
 * @component
 * @param {WelcomeCardProps} props - The properties for the WelcomeCard component.
 * @param {string} props.imgSrc - The source path for the card's icon image.
 * @param {string} props.title - The title text displayed on the card.
 * @param {string} props.text - The descriptive text displayed on the card.
 * @param {() => void} props.onClick - The function to be executed when the card is clicked.
 *
 * @returns {JSX.Element} A JSX element representing a clickable welcome card.
 */
export default function WelcomeCard({
    imgSrc,
    title,
    text,
    onClick,
}: WelcomeCardProps): JSX.Element {
    return (
        <>
            <div onClick={onClick} className='welcome-card grow'>
                <div className='welcome-card-content'>
                    <div className='welcome-icon'>
                        <img src={imgSrc} alt='Card Icon'></img>
                    </div>

                    <div className='welcome-txt'>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </div>
                </div>
            </div>            
        </>        
    );
}