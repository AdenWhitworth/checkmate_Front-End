import { ChangeEvent } from 'react';
import { Invite, Player } from '../../Providers/PlayerProvider/PlayerProviderTypes';

/**
 * Interface representing the output of the useSearchLobby hook.
 *
 * @interface UseSearchLobbyOutput
 * @property {function} handleSearchChange - Handles the change event on the search input field and updates the search keyword state.
 * @param {ChangeEvent<HTMLInputElement>} e - The change event from the search input field.
 * @property {Player[]} searchPlayerResults - An array of players whose usernames start with the search keyword.
 * @property {Invite[]} searchInviteResults - An array of invites whose request usernames start with the search keyword.
 */
export interface UseSearchLobbyOutput {
    handleSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
    searchPlayerResults: Player[];
    searchInviteResults: Invite[];
}
