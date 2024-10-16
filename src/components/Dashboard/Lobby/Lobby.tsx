import React from 'react';
import "./Lobby.css";
import { useSearchLobby } from '../../../Hooks/useSearchLobby/useSearchLobby';
import LobbyOptions from './LobbyOptions/LobbyOptions';
import SearchBar from '../../SearchBar/SearchBar';
import LobbyMenu from './LobbyMenu/LobbyMenu';
import { usePlayer } from '../../../Providers/PlayerProvider/PlayerProvider';
import ErrorLoading from '../../ErrorLoading/ErrorLoading';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

export default function Lobby(): JSX.Element {

    const {handleSearchChange, searchPlayerResults, searchInviteResults } = useSearchLobby();
    const { loadingPlayer, loadingInvites, loadingPlayers, errorPlayer} = usePlayer();

    return (   
        <div className="lobby">
            {(loadingPlayer || loadingInvites || loadingPlayers) ? (
                <LoadingSpinner></LoadingSpinner>
            ) : errorPlayer? (
               <ErrorLoading message={errorPlayer}></ErrorLoading> 
            ) : (
                <>
                    <LobbyOptions></LobbyOptions>

                    <SearchBar
                        onChange={handleSearchChange}
                    ></SearchBar>

                    <LobbyMenu
                        searchPlayerResults={searchPlayerResults}
                        searchInviteResults={searchInviteResults}
                    ></LobbyMenu>
                </>
            )}
        </div>
    );
}