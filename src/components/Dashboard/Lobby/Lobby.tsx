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
    const { loading, error} = usePlayer();

    return (   
        <div className="lobby">
            {(loading) ? (
                <LoadingSpinner></LoadingSpinner>
            ) : error? (
               <ErrorLoading message={error}></ErrorLoading> 
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