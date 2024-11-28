import React from 'react';
import "./BotInGameHelp.css";
import undo from "../../../../Images/undo white.svg";
import hint from "../../../../Images/hint white.svg";
import BotInGameHelpCard from './BotGameHelpCard/BotGameHelpCard';
import { useBot } from '../../../../Providers/BotProvider/BotProvider';


/**
 * Renders the in-game help options for a bot chess game. Includes buttons for undoing moves
 * and requesting hints, along with indicators for the remaining available actions.
 *
 * @component
 * @returns {JSX.Element} - The rendered BotInGameHelp component.
 */
export default function BotInGameHelp(): JSX.Element {
    const { remainingUndos, undoPreviousMove, requestHint, remainingHints } = useBot();

    return (
        <div className='ingame-help'>
            <BotInGameHelpCard 
                imgSrc={undo} 
                imgAlt="Undo Icon" 
                label="Undo"
                tallyCount={remainingUndos !== -1 ? remainingUndos : undefined} 
                onClick={undoPreviousMove} 
                disable={remainingUndos === 0} 
            />

            <BotInGameHelpCard 
                imgSrc={hint} 
                imgAlt='Hint Icon' 
                label='Hint' 
                tallyCount={remainingHints !== -1 ? remainingHints : undefined} 
                onClick={requestHint} 
                disable={remainingHints === 0} 
            />
        </div>
    );
}