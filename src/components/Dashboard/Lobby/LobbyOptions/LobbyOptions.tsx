import React, { useState } from 'react';
import globe from "../../../../Images/Globe.svg";
import reply_arrow from "../../../../Images/Reply Arrow.svg";
import "./LobbyOptions.css";
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';

export default function LobbyOptions(): JSX.Element {

    const { lobbySelection, setLobbySelection } = usePlayer();

    const handlePlayersClick = () => {
        setLobbySelection(false);
    };

    const handleInvitesClick = () => {
        setLobbySelection(true);
    };

    return (   
        <div className='lobby-options'>
            <div className={lobbySelection? "players-option unselected" : "players-option selected"} onClick={handlePlayersClick}>
                <img src={globe}></img>
                <h4>Players</h4>
            </div>

            <div className={lobbySelection? "invites-option selected" : "invites-option unselected"} onClick={handleInvitesClick}>
                <img src={reply_arrow}></img>
                <h4>Invites</h4>
            </div>
        </div>
    );
}