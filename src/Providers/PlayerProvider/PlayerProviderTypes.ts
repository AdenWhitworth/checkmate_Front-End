import { Timestamp } from "firebase/firestore";

/**
 * Represents a player's static information.
 * 
 * @interface PlayerStatic
 * @property {string} playerId - The ID of the player.
 * @property {string} userId - The ID of the user associated with the player.
 * @property {string} username - The username of the player.
 * @property {Timestamp} createdAt - The timestamp indicating when the player's profile was created.
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
 * @property {number} elo - The Elo rank of the player.
 * @property {string} [currentGameId] - Optional gameId for an active game the player is in.
 * @property {string} [currentBotGameId] - Optional gameId for an active bot game the player is in.
 * @property {string} email - The email address of the player.
 * @property {number} gamesPlayed - The total number of games the player has played.
 * @property {ActivePuzzle} [activePuzzle] - Optional currently active puzzle data.
 * @property {LastPuzzle} lastPuzzle - Tracks the last completed puzzle numbers for each difficulty level.
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
    activePuzzle?: ActivePuzzle;
    lastPuzzle: LastPuzzle;
}

/**
 * Tracks the last completed puzzle number for each difficulty level.
 *
 * @interface LastPuzzle
 * @property {number} easy - The number of the last completed puzzle for "easy" difficulty.
 * @property {number} medium - The number of the last completed puzzle for "medium" difficulty.
 * @property {number} hard - The number of the last completed puzzle for "hard" difficulty.
 */
export interface LastPuzzle {
    easy: number;
    medium: number;
    hard: number;
}

/**
 * Represents a summarized player list item.
 * 
 * @interface PlayerList
 * @property {string} playerId - The ID of the player.
 * @property {string} userId - The ID of the user associated with the player.
 * @property {string} username - The username of the player.
 * @property {number} elo - The Elo rank of the player.
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
 * @property {PlayerStatic | null} playerStatic - The static player data or null if unavailable.
 * @property {PlayerDynamic | null} playerDynamic - The dynamic player data or null if unavailable.
 * @property {(value: PlayerDynamic | null | ((prev: PlayerDynamic | null) => PlayerDynamic | null)) => void} setPlayerDynamic - Function to update the dynamic player state.
 * @property {boolean} loading - Indicates whether the player data is being loaded.
 * @property {string | null} error - Error message if there was an error loading player data, or null otherwise.
 * @property {PlayerList[]} players - An array of summarized player data.
 * @property {Invite[]} invites - An array of received invites.
 * @property {number} invitesCount - The total number of received invites.
 * @property {boolean} lobbySelection - Indicates if a lobby is selected.
 * @property {(value: boolean) => void} setLobbySelection - Function to update the lobby selection state.
 * @property {CompletedPuzzle[]} completedPuzzles - An array of puzzles completed by the player.
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
    completedPuzzles: CompletedPuzzle[];
}

/**
 * Represents an invitation received by a player to join a game.
 * 
 * @interface Invite
 * @property {string} requestPlayerId - The ID of the requesting player.
 * @property {string} requestGameId - The ID of the game related to the invitation.
 * @property {string} requestUserId - The ID of the user who sent the invite.
 * @property {string} requestUsername - The username of the user who sent the invite.
 * @property {number} requestElo - The Elo rank of the requesting player.
 * @property {string} inviteId - The unique identifier of the invite.
 */
export interface Invite {
    requestPlayerId: string;
    requestGameId: string;
    requestUserId: string;
    requestUsername: string;
    requestElo: number;
    inviteId: string;
}

/**
 * Represents a chess puzzle that has been completed by a user.
 *
 * @interface CompletedPuzzle
 * @property {string} puzzleId - The unique identifier of the completed puzzle.
 * @property {Timestamp} completedAt - The timestamp indicating when the puzzle was completed.
 * @property {number} timeToComplete - The total time taken to complete the puzzle, in seconds.
 */
export interface CompletedPuzzle {
    puzzleId: string;
    completedAt: Timestamp;
    timeToComplete: number;
}

/**
 * Represents the currently active chess puzzle for a user.
 *
 * @interface ActivePuzzle
 * @property {string} puzzleId - The unique identifier of the active puzzle.
 * @property {"easy" | "medium" | "hard"} difficulty - The difficulty level of the active puzzle.
 * @property {number} puzzleNumber - The sequential number of the puzzle within its difficulty level.
 * @property {Timestamp} startedAt - The timestamp indicating when the puzzle was started.
 */
export interface ActivePuzzle {
    puzzleId: string;
    difficulty: "easy" | "medium" | "hard";
    puzzleNumber: number;
    startedAt: Timestamp;
}

/**
 * Tracks the last completed puzzle number for each difficulty level.
 *
 * @interface LastPuzzle
 * @property {number} easy - The number of the last completed puzzle for "easy" difficulty.
 * @property {number} medium - The number of the last completed puzzle for "medium" difficulty.
 * @property {number} hard - The number of the last completed puzzle for "hard" difficulty.
 */
export interface LastPuzzle {
    easy: number;
    medium: number;
    hard: number;
}