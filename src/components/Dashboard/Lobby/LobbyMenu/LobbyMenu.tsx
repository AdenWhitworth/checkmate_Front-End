import React from 'react';
import "./LobbyMenu.css";
import { LobbyMenuProps } from './LobbyMenuTypes';
import PlayersItem from './PlayersItem/PlayersItem';
import InvitesItem from './InvitesItem/InvitesItem';
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';

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
                    searchPlayerResults.map((potentialPlayer, index) => (
                        <PlayersItem key={potentialPlayer.userId} potentialPlayer={potentialPlayer} index={index} />
                    ))
                )}
            </ul>
        </div>
    );
}
