import { useState, ChangeEvent, useMemo } from 'react';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { UseSearchLobbyOutput } from './useSearchLobbyTypes';

/**
 * Custom hook to handle search functionality in the lobby.
 * It allows filtering players and invites based on a search keyword.
 *
 * @returns {UseSearchLobbyOutput} The returned functions and properties from the useSearchLobby hook.
 */
export const useSearchLobby = (): UseSearchLobbyOutput => {
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const { players, invites } = usePlayer();
    
    /**
     * Handles the change event on the search input field and updates the search keyword state.
     *
     * @param {ChangeEvent<HTMLInputElement>} e - The change event from the search input field.
     */
    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value.toLowerCase());
    };

    /**
     * Filters the list of players based on the search keyword.
     * The search is case-insensitive and checks if the player's username starts with the search keyword.
     *
     * @returns {Array} An array of players matching the search keyword.
     */
    const searchPlayerResults = useMemo(() => {
        return players.filter(player => player.username.toLowerCase().startsWith(searchKeyword));
    }, [searchKeyword, players]);

    /**
     * Filters the list of invites based on the search keyword.
     * The search is case-insensitive and checks if the invite's request username starts with the search keyword.
     *
     * @returns {Array} An array of invites matching the search keyword.
     */
    const searchInviteResults = useMemo(() => {
        return invites.filter(invite => invite.requestUsername.toLowerCase().startsWith(searchKeyword));
    }, [searchKeyword, invites]);

    return { handleSearchChange, searchPlayerResults, searchInviteResults };
};
