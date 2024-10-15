import React from 'react';
import "./Lobby.css";
import { useSearchLobby } from '../../../Hooks/useSearchLobby/useSearchLobby';
import LobbyOptions from './LobbyOptions/LobbyOptions';
import SearchBar from '../../SearchBar/SearchBar';
import LobbyMenu from './LobbyMenu/LobbyMenu';

export default function Lobby(): JSX.Element {

    const {handleSearchChange, searchPlayerResults, searchInviteResults } = useSearchLobby();

    return (   
        <div className="lobby">
            
            <LobbyOptions></LobbyOptions>

            <SearchBar
                onChange={handleSearchChange}
            ></SearchBar>

            <LobbyMenu
                searchPlayerResults={searchPlayerResults}
                searchInviteResults={searchInviteResults}
            ></LobbyMenu>
        </div>
    );
}