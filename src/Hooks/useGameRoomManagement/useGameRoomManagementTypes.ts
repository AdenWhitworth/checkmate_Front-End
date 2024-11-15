import { Move } from 'chess.js';
import { Opponent, Game } from '../../Providers/GameProvider/GameProviderTypes';
import { Invite, Player } from '../../Providers/PlayerProvider/PlayerProviderTypes';

/**
 * Defines the properties required by the `useGameRoomManagement` hook.
 * These properties are used for managing game rooms, handling game states,
 * updating UI components, and managing player connections.
 * 
 * @interface UseGameRoomManagementProps
 * 
 * @property {() => void} cleanup - Function to clean up resources and reset states.
 * @property {Opponent | null} opponent - The current opponent's information, or `null` if not set.
 * @property {Game | null} game - The current game object, or `null` if no game is active.
 * @property {(game: Game | null) => void} setGame - Function to update the game state.
 * @property {(value: string) => void} setFen - Function to set the current FEN string for the chessboard.
 * @property {(value: Move[]) => void} setHistory - Function to set the move history.
 * @property {(orientation: "w" | "b") => void} setOrientation - Function to set the player's orientation (white or black).
 * @property {(opponent: Opponent | null) => void} setOpponent - Function to set the opponent's details.
 * @property {(value: "w" | "b") => void} setPlayerTurn - Function to update the current player's turn.
 * @property {(value: boolean) => void} setLoadingOver - Function to set the loading state when closing a game.
 * @property {(value: string | null) => void} setErrorOver - Function to set the error message when closing a game.
 * @property {(value: boolean) => void} setExitGame - Function to update the state when exiting a game.
 * @property {(value: boolean) => void} setLoadingExit - Function to set the loading state when exiting a game.
 * @property {(value: string | null) => void} setErrorExit - Function to set the error message when exiting a game.
 * @property {(value: boolean) => void} setLoadingForfeit - Function to set the loading state when forfeiting a game.
 * @property {(value: string | null) => void} setErrorForfeit - Function to set the error message when forfeiting a game.
 * @property {(value: boolean) => void} setForfeitGame - Function to update the state when forfeiting a game.
 * @property {(value: string | null) => void} setLoadingCreateGameOpponentUserId - Function to set the loading state when creating a game with a specific opponent.
 * @property {(value: string | null) => void} setSuccessCreateGame - Function to set the success message when a game is created.
 * @property {(value: string | null) => void} setErrorCreateGame - Function to set the error message when creating a game.
 * @property {(value: string | null) => void} setLoadingJoinGameOpponentUserId - Function to set the loading state when joining a game.
 * @property {(value: string | null) => void} setErrorJoinGame - Function to set the error message when joining a game.
 * @property {(value: string | null) => void} setSuccessJoinGame - Function to set the success message when joining a game.
 * @property {() => "playerA" | "playerB" | "draw" | null} findWinner - Function to determine the winner of the game.
 */
export interface UseGameRoomManagementProps {
    cleanup: () => void;
    opponent: Opponent | null;
    game: Game | null;
    setGame: (game: Game | null) => void;
    setFen:(value: string) => void;
    setHistory: (value: Move[]) => void;
    setOrientation: (orientation: "w" | "b") => void;
    setOpponent: (opponent: Opponent | null) => void;
    setPlayerTurn: (value: "w" | "b") => void;
    setLoadingOver: (value: boolean) => void;
    setErrorOver: (value: string | null) => void;
    setExitGame: (value: boolean) => void;
    setLoadingExit: (value: boolean) => void;
    setErrorExit: (value: string | null) => void;
    setLoadingForfeit: (value: boolean) => void;
    setErrorForfeit: (value: string | null) => void;
    setForfeitGame: (value: boolean) => void;
    setLoadingCreateGameOpponentUserId: (value: string | null) => void;
    setSuccessCreateGame: (value: string | null) => void;
    setErrorCreateGame: (value: string | null) => void;
    setLoadingJoinGameOpponentUserId: (value: string | null) => void;
    setErrorJoinGame: (value: string | null) => void;
    setSuccessJoinGame: (value: string | null) => void;
    findWinner: () => "playerA" | "playerB" | "draw" | null;
}

/**
 * Defines the functions returned by the `useGameRoomManagement` hook.
 * These functions are used to manage the game room lifecycle, such as creating, joining, exiting, forfeiting, and closing a game.
 * 
 * @interface UseGameRoomManagementOutput
 * 
 * @property {() => void} handleForfeit - Function to handle forfeiting the current game.
 * @property {() => void} handleExitRoom - Function to handle exiting the current game room.
 * @property {(potentialOpponent: Player) => void} handleCreateRoom - Function to create a new game room with a selected opponent.
 * @property {(invite: Invite) => void} handleJoinRoom - Function to join a game room using an invitation.
 * @property {() => void} handleCloseRoom - Function to handle closing the current game room.
 */
export interface UseGameRoomManagementOutput {
    handleForfeit: () => void;
    handleExitRoom: () => void;
    handleCreateRoom: (potentialOpponent: Player) => void;
    handleJoinRoom: (invite: Invite) => void;
    handleCloseRoom: () => void;
}