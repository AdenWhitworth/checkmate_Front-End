import React from 'react';
import "./BotLobbyTitle.css";
import bot from "../../../../Images/bot white.svg";

/**
 * A React functional component that represents the title section of the bot lobby.
 * 
 * The `BotLobbyTitle` component displays an icon and a heading to introduce the bot lobby.
 * 
 * @component
 * @returns {JSX.Element} A JSX element containing the title section for the bot lobby.
 */
export default function BotLobbyTitle(): JSX.Element {
    return (
        <div className="bot-lobby-title">
            <div className="bot-lobby-title-img">
                <img src={bot} alt="Bot icon" />
            </div>
            <h4>Play Bots</h4>
        </div>
    );
}
