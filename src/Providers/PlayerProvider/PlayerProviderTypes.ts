import { Room } from "../GameProvider/GameProviderTypes";

/**
 * Represents a player's information.
 * 
 * @interface Player
 * @property {string} playerId - The ID of the player.
 * @property {string} userId - The ID of the user associated with the player.
 * @property {string} username - The username of the player.
 * @property {number} [win] - Optional number of wins by the player.
 * @property {number} [loss] - Optional number of losses by the player.
 */
export interface Player {
    playerId: string;
    userId: string;
    username: string;
    win?: number;
    loss?: number;
}

/**
 * Represents the context values provided by the PlayerProvider.
 * 
 * @interface PlayerContextType
 * @property {Player | null} player - The currently logged-in player or null if not available.
 * @property {boolean} loading - Indicates whether the player data is being loaded.
 * @property {string | null} error - Error message if there was an error loading player data, or null if there is no error.
 * @property {Player[]} players - An array of other available players.
 * @property {Invite[]} invites - An array of received invites.
 * @property {number} invitesCount - The total count of invites.
 * @property {boolean} lobbySelection - Indicates if a lobby is selected.
 * @property {(value: boolean) => void} setLobbySelection - Function to update the lobby selection state.
 */
export interface PlayerContextType {
    player: Player | null;
    loading: boolean;
    error: string | null;
    players: Player[];
    invites: Invite[];
    invitesCount: number;
    lobbySelection: boolean;
    setLobbySelection: (value: boolean) => void;
}

/**
 * Represents an invitation received by a player to join a game.
 * 
 * @interface Invite
 * @property {number} requestLoss - Number of losses of the requesting player.
 * @property {string} requestPlayerId - ID of the requesting player.
 * @property {Room} requestRoom - Information about the room that the invite pertains to.
 * @property {string} requestUserId - ID of the user who sent the invite.
 * @property {string} requestUsername - Username of the user who sent the invite.
 * @property {number} requestWin - Number of wins of the requesting player.
 * @property {string} inviteId - The unique ID of the invite.
 */
export interface Invite {
    requestLoss: number;
    requestPlayerId: string;
    requestRoom: Room;
    requestUserId: string;
    requestUsername: string;
    requestWin: number;
    inviteId: string;
}