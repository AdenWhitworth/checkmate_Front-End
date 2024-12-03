import { Timestamp } from "firebase/firestore";

/**
 * Represents a player's static information.
 * 
 * @interface PlayerStatic
 * @property {string} playerId - The ID of the player.
 * @property {string} userId - The ID of the user associated with the player.
 * @property {string} username - The username of the player.
 */
export interface PlayerStatic {
    playerId: string;
    userId: string;
    username: string;
    createdAt: Timestamp;
}

/**
 * Represents a player's dynamic information.
 * 
 * @interface PlayerDynamic
 * @property {number} [win] - Optional number of wins by the player.
 * @property {number} [loss] - Optional number of losses by the player.
 * @property {number} [draw] - Optional number of draws by the player.
 * @property {number} elo - Wlo rank of the player.
 * @property {string} [currentGameId] - Optional gameId for an active game the player is in.
 */
export interface PlayerDynamic {
    win?: number;
    loss?: number;
    draw?: number;
    elo: number;
    currentGameId?: string;
    currentBotGameId?: string;
    email: string;
    gamesPlayed: number;
}

/**
 * Represents a list player's information.
 * 
 * @interface PlayerList
 * @property {string} playerId - The ID of the player.
 * @property {string} userId - The ID of the user associated with the player.
 * @property {string} username - The username of the player.
 * @property {number} [win] - Optional number of wins by the player.
 * @property {number} [loss] - Optional number of losses by the player.
 * @property {number} [draw] - Optional number of draws by the player.
 * @property {number} elo - Wlo rank of the player.
 * @property {string} [currentGameId] - Optional gameId for an active game the player is in.
 */
export interface PlayerList {
    playerId: string;
    userId: string;
    username: string;
    elo: number;
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
    playerStatic: PlayerStatic | null;
    playerDynamic: PlayerDynamic | null;
    setPlayerDynamic: (value: PlayerDynamic | null | ((prev: PlayerDynamic | null) => PlayerDynamic | null)) => void;
    loading: boolean;
    error: string | null;
    players: PlayerList[];
    invites: Invite[];
    invitesCount: number;
    lobbySelection: boolean;
    setLobbySelection: (value: boolean) => void;
}

/**
 * Represents an invitation received by a player to join a game.
 * 
 * @interface Invite
 * @property {string} requestPlayerId - ID of the requesting player.
 * @property {Room} requestGameId - ID of the game that the invite pertains to.
 * @property {string} requestUserId - ID of the user who sent the invite.
 * @property {string} requestUsername - Username of the user who sent the invite.
 * @property {number} requestElo - Elo rank of the requesting player.
 * @property {string} inviteId - The unique ID of the invite.
 */
export interface Invite {
    requestPlayerId: string;
    requestGameId: string;
    requestUserId: string;
    requestUsername: string;
    requestElo: number;
    inviteId: string;
}