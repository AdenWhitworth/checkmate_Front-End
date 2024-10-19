import React from 'react';
import "./Lobby.css";
import { useSearchLobby } from '../../../Hooks/useSearchLobby/useSearchLobby';
import LobbyOptions from './LobbyOptions/LobbyOptions';
import SearchBar from '../../SearchBar/SearchBar';
import LobbyMenu from './LobbyMenu/LobbyMenu';
import { usePlayer } from '../../../Providers/PlayerProvider/PlayerProvider';
import ErrorLoading from '../../ErrorLoading/ErrorLoading';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';

/**
 * Lobby component that displays the lobby interface for searching and interacting with players.
 * Depending on the current state, it displays a loading spinner, error message, or the lobby content.
 * The lobby content includes search options for players or invites, and lists of search results.
 *
 * @component
 * @returns {JSX.Element} The rendered Lobby component.
 */
export default function Lobby(): JSX.Element {

    const {handleSearchChange, searchPlayerResults, searchInviteResults } = useSearchLobby();
    const { loading, error} = usePlayer();

    return (   
        <div className="lobby">
            {loading ? (
                <LoadingSpinner />
            ) : error? (
               <ErrorLoading message={error} /> 
            ) : (
                <>
                    <LobbyOptions />
                    <SearchBar onChange={handleSearchChange} />

                    <LobbyMenu
                        searchPlayerResults={searchPlayerResults}
                        searchInviteResults={searchInviteResults}
                    />
                </>
            )}
        </div>
    );
}