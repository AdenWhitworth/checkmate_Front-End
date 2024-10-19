import React from 'react';
import "./LobbyMenu.css";
import { LobbyMenuProps } from './LobbyMenuTypes';
import PlayersItem from './PlayersItem/PlayersItem';
import InvitesItem from './InvitesItem/InvitesItem';
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';
/**
 * LobbyMenu component renders a list of players or invites based on the current lobby selection state.
 * It displays either search results for players to invite or invitations received from other users.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.searchPlayerResults - List of players matching the search criteria.
 * @param {Array} props.searchInviteResults - List of invite objects received by the player.
 * 
 * @returns {JSX.Element} The rendered LobbyMenu component.
 */
export default function LobbyMenu({
    searchPlayerResults,
    searchInviteResults
}: LobbyMenuProps): JSX.Element {
    const { lobbySelection } = usePlayer();

    return (   
        <div className="lobby-menu">
            <ul>
                {lobbySelection ? (
                    searchInviteResults.map((invite, index) => (
                        <InvitesItem key={invite.requestUserId} invite={invite} index={index} />
                    ))
                ) : (
                    searchPlayerResults.map((potentialOpponent, index) => (
                        <PlayersItem key={potentialOpponent.userId} potentialOpponent={potentialOpponent} index={index} />
                    ))
                )}
            </ul>
        </div>
    );
}
