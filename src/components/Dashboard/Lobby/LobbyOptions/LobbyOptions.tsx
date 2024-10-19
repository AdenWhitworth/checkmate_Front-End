import React from 'react';
import globe from "../../../../Images/Globe.svg";
import reply_arrow from "../../../../Images/Reply Arrow.svg";
import "./LobbyOptions.css";
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';

/**
 * LobbyOptions component for toggling between player and invite views in the lobby.
 * 
 * @component
 * @returns {JSX.Element} The rendered LobbyOptions component.
 */
export default function LobbyOptions(): JSX.Element {

    const { lobbySelection, setLobbySelection } = usePlayer();

    /**
     * Handles the click event to switch to the player selection view.
     */
    const handlePlayersClick = () => {
        setLobbySelection(false);
    };

    /**
     * Handles the click event to switch to the invite selection view.
     */
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