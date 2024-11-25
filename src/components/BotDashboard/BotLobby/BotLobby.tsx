import React from 'react';
import "./BotLobby.css";
import BotLobbyTitle from './BotLobbyTitle/BotLobbyTitle';
import BotOptionList from './BotOptionList/BotOptionList';
import BotSettings from './BotSettings/BotSettings';
import Button from '../../Button/Button';

/**
 * A React functional component representing the bot lobby interface for selecting game settings.
 * 
 * The `BotLobby` component combines multiple child components to provide the following features:
 * - A title section (`BotLobbyTitle`).
 * - A list of bot difficulty options (`BotOptionList`).
 * - Game settings configuration (`BotSettings`).
 * - A play button to start the game.
 * 
 * @component
 * @returns {JSX.Element} The JSX representation of the bot lobby interface.
 */
export default function BotLobby(): JSX.Element {
    return (
        <div className="bot-lobby">
            <BotLobbyTitle />
            <BotOptionList />
            <BotSettings />
            <div className='bot-options-btn'>
                <Button styleType='primary' className='full-button'>Play</Button>
            </div>
        </div>
    );
}