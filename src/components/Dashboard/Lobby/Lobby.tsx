import React, { useState } from 'react';
import "./Lobby.css";
import { useSearchLobby } from '../../../Hooks/useSearchLobby/useSearchLobby';
import LobbyOptions from './LobbyOptions/LobbyOptions';
import SearchBar from '../../SearchBar/SearchBar';

export default function Lobby(): JSX.Element {

    const {handleSearchChange, searchResults } = useSearchLobby();

    return (   
        <div className="lobby">
            
            <LobbyOptions></LobbyOptions>

            <SearchBar
                onChange={handleSearchChange}
            ></SearchBar>

            {/*}
            <div className="available-players">
                  <ul className="players-list">
                    
                    {selection? searchInvites.map((item, index) => <InvitesItem setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} setRoom={setRoom} setGamePlayers={setGamePlayers} setOrientation={setOrientation} key={item.id} count={Object.keys(searchInvites).length} item={item} index={index} playerId={playerId} userId={userId} username={username}/>) : searchPlayers.map((item, index) => <PlayersItem setNetworkError={setNetworkError} setNetworkReason={setNetworkReason} socket={socket} win={win} loss={loss} setRoom={setRoom} setOrientation={setOrientation} key={item.id} count={Object.keys(searchPlayers).length} item={item} index={index} playerId={playerId} userId={userId} username={username}/>)}

                  </ul>
            </div>
            */}
        </div>
    );
}