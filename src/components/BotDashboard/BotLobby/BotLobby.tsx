import React from 'react';
import "./BotLobby.css";
import BotLobbyTitle from './BotLobbyTitle/BotLobbyTitle';
import BotOptionList from './BotOptionList/BotOptionList';
import BotSettings from './BotSettings/BotSettings';
import Button from '../../Button/Button';
import { useBot } from '../../../Providers/BotProvider/BotProvider';
import LoadingDots from '../../LoadingDots/LoadingDots';

/**
 * Renders the bot lobby interface for selecting game options, settings, and starting a new bot game.
 *
 * @component
 * @returns {JSX.Element} - The rendered BotLobby component.
 */
export default function BotLobby(): JSX.Element {
    const { handleCreateBotGame, loadingCreateGame } = useBot();

    /**
     * Handles the Play button click event to initiate a new bot game.
     */
    const handlePlayClick = () => {
        handleCreateBotGame();
    }
    
    return (
        <div className="bot-lobby" data-testid="bot-lobby">
            <BotLobbyTitle />
            <BotOptionList />
            <BotSettings />
            <div className='bot-options-btn'>
                <Button 
                    onClick={handlePlayClick} 
                    styleType='primary' 
                    className='full-button' 
                    disabled={loadingCreateGame}
                >{loadingCreateGame? <LoadingDots position={'center'} color={'black'} size={'small'} />: "Play"}</Button>
            </div>
        </div>
    );
}