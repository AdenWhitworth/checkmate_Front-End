import { Move, Chess, Square } from "chess.js";
import { Invite, PlayerList } from "../PlayerProvider/PlayerProviderTypes";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { Timestamp } from 'firebase/firestore';

/**
 * Represents a player actively participating in a game.
 * 
 * @interface InGamePlayer
 * 
 * @property {string} userId - The unique identifier of the player.
 * @property {string} playerId - The unique identifier for the player's profile.
 * @property {string} username - The display name of the player.
 * @property {number} elo - The Elo rating of the player used to indicate their skill level.
 * @property {boolean | "pending"} connected - Indicates whether the player is connected to the game.
 *                                             Can be `true`, `false`, or `"pending"` if awaiting connection.
 * @property {"w" | "b"} orientation - The color of the player's pieces, either "w" (white) or "b" (black).
 */
export interface InGamePlayer{
    userId: string;
    playerId: string;
    username: string;
    elo: number;
    connected: boolean | "pending";
    orientation: "w" | "b";
}

/**
 * Represents the state and metadata of a chess game.
 * 
 * @interface Game
 * 
 * @property {string} gameId - The unique identifier for the game session.
 * @property {InGamePlayer} playerA - The player who created the game (Player A).
 * @property {InGamePlayer} playerB - The player who joined the game (Player B).
 * @property {string} fen - The current FEN (Forsyth–Edwards Notation) string representing the game board state.
 * @property {string[]} history - An array of serialized moves made during the game.
 * @property {"w" | "b"} currentTurn - Indicates which player's turn it is to move.
 * @property {"in-progress" | "completed" | "waiting"} status - The current status of the game.
 * @property {"playerA" | "playerB" | "draw" | null} winner - Indicates the winner of the game.
 * @property {Timestamp} lastMoveTime - Timestamp of the last move made.
 * @property {Timestamp} createdAt - Timestamp of when the game was created.
 */
export interface Game {
    gameId: string;
    playerA: InGamePlayer;
    playerB: InGamePlayer;
    fen: string;
    history: string[];
    currentTurn: "w" | "b";
    status: "in-progress" | "completed" | "waiting";
    winner: "playerA" | "playerB" | "draw" | null;
    lastMoveTime: Timestamp;
    createdAt: Timestamp;
}

/**
 * Represents information about the opponent player.
 * 
 * @interface Opponent
 * 
 * @property {string} opponentUsername - The display name of the opponent.
 * @property {string} opponentUserId - The unique identifier for the opponent user.
 * @property {string} opponentPlayerId - The unique identifier for the opponent's profile.
 * @property {number} opponentElo - The Elo rating of the opponent.
 * @property {string} [opponentInviteId] - The unique identifier of the game invite (optional).
 */
export interface Opponent {
    opponentUsername: string;
    opponentUserId: string;
    opponentPlayerId: string;
    opponentElo: number;
    opponentInviteId?: string;
}

/**
 * Context type for managing the game state, player information, and game actions.
 * 
 * @interface GameContextType
 * 
 * @property {"w" | "b"} playerTurn - Indicates the current player's turn.
 * @property {(value: "w" | "b") => void} setPlayerTurn - Function to update the player's turn.
 * @property {Move[]} history - The history of moves made in the game.
 * @property {(value: Move[]) => void} setHistory - Function to update the move history.
 * @property {Opponent | null} opponent - Information about the opponent player.
 * @property {(value: Opponent | null) => void} setOpponent - Function to update the opponent details.
 * @property {"w" | "b"} orientation - The player's orientation ("w" for white or "b" for black).
 * @property {(value: "w" | "b") => void} setOrientation - Function to set the player's orientation.
 * @property {Game | null} game - The current game object.
 * @property {(game: Game | null) => void} setGame - Function to update the game object.
 * @property {string} fen - The current FEN string representing the board state.
 * @property {(value: string) => void} setFen - Function to set the current FEN string.
 * @property {string | null} gameOver - Indicates the game result ("win", "loss", "draw").
 * @property {boolean} loadingOver - Loading state for ending the game.
 * @property {string | null} errorOver - Error message related to game over actions.
 * @property {(value: string | null) => void} setGameOver - Function to set the game result.
 * @property {() => void} cleanup - Function to clean up resources and reset game state.
 * @property {Chess} chess - The current chess instance for managing game moves.
 * @property {boolean} forfeitGame - State indicating if the game was forfeited.
 * @property {(value: boolean) => void} setForfeitGame - Function to set forfeit state.
 * @property {boolean} loadingForfeit - Loading state for forfeiting the game.
 * @property {string | null} errorForfeit - Error message related to forfeiting the game.
 * @property {() => void} handleForfeit - Function to handle game forfeiture.
 * @property {boolean} exitGame - State indicating if the player wants to exit the game.
 * @property {(value: boolean) => void} setExitGame - Function to set the exit game state.
 * @property {boolean} loadingExit - Loading state for exiting the game.
 * @property {string | null} errorExit - Error message related to exiting the game.
 * @property {() => void} handleExitRoom - Function to handle exiting the current game room.
 * @property {string | null} loadingCreateGameOpponentUserId - Loading state for creating a game with a specific opponent.
 * @property {string | null} errorCreateGame - Error message related to creating a game.
 * @property {(value: string | null) => void} setErrorCreateGame - Function to set the error message for game creation.
 * @property {string | null} successCreateGame - Success message for game creation.
 * @property {(value: string | null) => void} setSuccessCreateGame - Function to set the success message for game creation.
 * @property {(value: PlayerList) => void} handleCreateRoom - Function to create a game room with an opponent.
 * @property {string | null} loadingJoinGameOpponentUserId - Loading state for joining a game.
 * @property {string | null} errorJoinGame - Error message related to joining a game.
 * @property {(value: string | null) => void} setErrorJoinGame - Function to set error message for joining a game.
 * @property {string | null} successJoinGame - Success message for joining a game.
 * @property {(value: string | null) => void} setSuccessJoinGame - Function to set success message for joining a game.
 * @property {(value: Invite) => void} handleJoinRoom - Function to join a game room using an invite.
 * @property {(sourceSquare: Square, targetSquare: Square) => boolean} onDrop - Function to handle piece drop during a move.
 * @property {() => void} handleCloseRoom - Function to handle closing the game room.
 * @property {string | null} errorMove - Error message related to making a move.
 * @property {(value: string | null) => void} setErrorMove - Function to set error message for moves.
 * @property {GameMoves[]} gameMoves - List of game moves for displaying move history.
 * @property {(value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void} setGameMoves - Function to update the game moves.
 * @property {function} setIsOpponentDisconnected - Function to set the disconnect/reconnect message.
 */
export interface GameContextType {
    playerTurn: "w" | "b";
    setPlayerTurn: (value: "w" | "b") => void;
    history: Move[];
    setHistory: (value: Move[]) => void;
    opponent: Opponent | null;
    setOpponent: (value: Opponent | null) => void;
    orientation: "w" | "b";
    setOrientation: (value: "w" | "b") => void;
    game: Game | null;
    setGame: (game: Game | null) => void;
    fen: string;
    setFen: (value: string) => void;
    gameOver: string | null;
    loadingOver: boolean;
    errorOver: string | null;
    setGameOver: (value: string | null) => void;
    cleanup: () => void;
    chess: Chess;
    forfeitGame: boolean;
    setForfeitGame: (value: boolean) => void;
    loadingForfeit: boolean;
    errorForfeit: string | null;
    handleForfeit: () => void;
    exitGame: boolean
    setExitGame: (value: boolean) => void;
    loadingExit: boolean;
    errorExit: string | null;
    handleExitRoom: () => void;
    loadingCreateGameOpponentUserId: string | null;
    errorCreateGame: string | null;
    setErrorCreateGame: (value: string | null) => void;
    successCreateGame: string | null;
    setSuccessCreateGame: (value: string | null) => void;
    handleCreateRoom: (value: PlayerList) => void;
    loadingJoinGameOpponentUserId: string | null;
    errorJoinGame: string | null;
    setErrorJoinGame: (value: string | null) => void;
    successJoinGame: string | null;
    setSuccessJoinGame: (value: string | null) => void;
    handleJoinRoom: (value: Invite) => void;
    onDrop:(sourceSquare: Square, targetSquare: Square) => boolean;
    handleCloseRoom: () => void;
    errorMove: string | null;
    setErrorMove: (value: string | null) => void;
    gameMoves: GameMoves[];
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
    isOpponentDisconnected: string | null;
    setIsOpponentDisconnected: (value: string | null) => void;
}