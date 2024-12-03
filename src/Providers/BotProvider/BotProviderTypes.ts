import { Chess, Move, Square } from "chess.js";
import { Game } from "../GameProvider/GameProviderTypes";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

/**
 * Interface defining the context type for managing bot-related gameplay state and actions.
 *
 * The `BotContextType` encapsulates all the state variables, methods, and utilities required for
 * managing a chess game involving a bot, including game setup, move management, hints, undo functionality,
 * promotions, reconnections, and game lifecycle management.
 *
 * @interface BotContextType
 * @property {"novice" | "intermediate" | "advanced" | "master"} difficulty - The bot's difficulty level.
 * @property {(difficulty: "novice" | "intermediate" | "advanced" | "master") => void} setDifficulty - Updates the bot's difficulty level.
 * @property {"assisted" | "friendly" | "challenge"} help - The level of assistance provided during the game.
 * @property {(help: "assisted" | "friendly" | "challenge") => void} setHelp - Updates the level of assistance.
 * @property {"w" | "b"} orientation - The player's orientation (white or black pieces).
 * @property {(orientation: "w" | "b") => void} setOrientation - Updates the player's orientation.
 * @property {"w" | "b"} playerTurn - Indicates whose turn it is to play (white or black).
 * @property {(value: "w" | "b") => void} setPlayerTurn - Updates the current turn.
 * @property {Move[]} history - Array of moves made during the game.
 * @property {(value: Move[]) => void} setHistory - Updates the game's move history.
 * @property {BotGame | null} botGame - The current bot game instance.
 * @property {(botGame: BotGame | null) => void} setBotGame - Updates the bot game instance.
 * @property {string} fen - The FEN (Forsyth–Edwards Notation) string representing the current board state.
 * @property {(value: string) => void} setFen - Updates the FEN string for the game.
 * @property {string | null} gameOver - The result of the game, if it has ended (e.g., "checkmate", "stalemate", or `null`).
 * @property {(value: string | null) => void} setGameOver - Updates the game-over state.
 * @property {() => void} cleanup - Resets and cleans up all context state.
 * @property {Chess} chess - An instance of the `Chess` class from the `chess.js` library for managing game logic.
 * @property {string | null} errorMove - Error message for invalid moves, if any.
 * @property {(value: string | null) => void} setErrorMove - Updates the error message for invalid moves.
 * @property {GameMoves[]} gameMoves - Array of moves made during the game, including additional metadata.
 * @property {(value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void} setGameMoves - Updates the array of game moves.
 * @property {(sourceSquare: Square, targetSquare: Square) => boolean} onDrop - Handles piece drops on the chessboard. Returns `true` if the move is valid, otherwise `false`.
 * @property {() => Promise<void>} handleCreateBotGame - Function to create a new bot game.
 * @property {boolean} loadingCreateGame - Indicates whether a bot game is being created.
 * @property {string | null} errorCreateGame - Error message when creating a bot game fails.
 * @property {string | null} successCreateGame - Success message when a bot game is created successfully.
 * @property {number} remainingUndos - Number of remaining undo actions available to the player.
 * @property {() => void} undoPreviousMove - Function to undo the previous move (player and opponent's).
 * @property {number} remainingHints - Number of remaining hints available to the player.
 * @property {[Square, Square] | null} hint - The current hint as a tuple of squares (`[source, target]`) or `null` if no hint is active.
 * @property {() => void} requestHint - Function to request a hint for the next best move.
 * @property {boolean} forfeitBotGame - Indicates whether the player is forfeiting the game.
 * @property {(value: boolean) => void} setForfeitBotGame - Updates the forfeit game state.
 * @property {() => void} handleForfeit - Function to handle game forfeiture.
 * @property {boolean} loadingForfeit - Indicates whether a forfeit action is being processed.
 * @property {string | null} errorForfeit - Error message when forfeiting a game fails.
 * @property {() => void} handleCloseBotGame - Function to close the current bot game.
 * @property {boolean} loadingOver - Indicates whether the game over state is being processed.
 * @property {string | null} errorOver - Error message when closing the game fails.
 * @property {(value: string | null) => void} setErrorCreateGame - Updates the error message for creating a game.
 * @property {(value: string | null) => void} setSuccessCreateGame - Updates the success message for creating a game.
 * @property {Record<string, any>} highlightedSquares - A record of square highlights for showing move options or game states.
 * @property {(value: Record<string, any>) => void} setHighlightedSquares - Updates the highlighted squares on the board.
 * @property {(square: Square) => void} onSquareClick - Handles clicks on squares to show available moves or other game actions.
 * @property {(piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean} onPromotionPieceSelect - Handles pawn promotions. Accepts the promotion piece and promotion squares. Returns `true` if the promotion is successful, otherwise `false`.
 * @property {() => Promise<void>} handleReconnectBotGame - Function to reconnect to an active bot game. Fetches the game state and updates the board locally.
 * @property {boolean} reconnectGame - Indicates whether the player is reconnecting to an existing bot game.
 * @property {(reconnectGame: boolean) => void} setReconnectGame - Updates the reconnect game state.
 * @property {boolean} loadingReconnectGame - Indicates whether the reconnection process is ongoing.
 * @property {string | null} errorReconnectGame - Error message when reconnecting to a bot game fails.
 * @property {string | null} errorHint - Error message for failed hint requests.
 * @property {(value: string | null) => void} setErrorHint - Updates the error message for hint requests.
 * @property {string | null} errorUndo - Error message for failed undo actions.
 * @property {(value: string | null) => void} setErrorUndo - Updates the error message for undo actions.
 * @property {boolean} loadingHint - Indicates whether the hint has been proccessed or is loading.
 */
export interface BotContextType {
    difficulty: "novice" | "intermediate" | "advanced" | "master";
    setDifficulty: (difficulty: "novice" | "intermediate" | "advanced" | "master") => void;
    help: "assisted" | "friendly" | "challenge";
    setHelp: (help: "assisted" | "friendly" | "challenge") => void;
    orientation: "w" | "b";
    setOrientation: (orientation: "w" | "b") => void;
    playerTurn: "w" | "b";
    setPlayerTurn: (value: "w" | "b") => void;
    history: Move[];
    setHistory: (value: Move[]) => void;
    botGame: BotGame | null;
    setBotGame: (botGame: BotGame | null) => void;
    fen: string;
    setFen: (value: string) => void;
    gameOver: string | null;
    setGameOver: (value: string | null) => void;
    cleanup: () => void;
    chess: Chess;
    errorMove: string | null;
    setErrorMove: (value: string | null) => void;
    gameMoves: GameMoves[];
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
    onDrop:(sourceSquare: Square, targetSquare: Square) => boolean;
    handleCreateBotGame: () => Promise<void>;
    loadingCreateGame:  boolean;
    errorCreateGame: string | null;
    successCreateGame: string | null;
    remainingUndos: number;
    undoPreviousMove: () => void;
    remainingHints: number;
    hint: [Square,Square] | null;
    requestHint: () => void;
    forfeitBotGame: boolean;
    setForfeitBotGame: (value: boolean) => void;
    handleForfeit: () => void;
    loadingForfeit: boolean;
    errorForfeit: string | null;
    handleCloseBotGame: () => void;
    loadingOver: boolean;
    errorOver: string | null;
    setErrorCreateGame: (value: string | null) => void;
    setSuccessCreateGame: (value: string | null) => void;
    highlightedSquares: Record<string, any>;
    setHighlightedSquares: (value: Record<string, any>) => void;
    onSquareClick: (square: Square) => void;
    onPromotionPieceSelect: (piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean;
    handleReconnectBotGame: () => Promise<void>;
    reconnectGame: boolean;
    setReconnectGame: (reconnectGame: boolean) => void;
    loadingReconnectGame: boolean;
    errorReconnectGame: string | null;
    errorHint: string | null;
    setErrorHint: (value: string | null) => void;
    errorUndo: string | null;
    setErrorUndo: (value: string | null) => void;
    loadingHint: boolean;
}

/**
 * Interface defining the properties of a bot game instance, extending the general `Game` interface.
 *
 * @interface BotGame
 * @extends Game
 * @property {"novice" | "intermediate" | "advanced" | "master"} difficulty - The difficulty level of the bot.
 * @property {"assisted" | "friendly" | "challenge"} help - The level of assistance provided during the game.
 * @property {number} remainingUndos - The number of undos left for the player in the game.
 * @property {number} remainingHints - The number of hints left for the player in the game.
 */
export interface BotGame extends Game{
    difficulty: "novice" | "intermediate" | "advanced" | "master";
    help: "assisted" | "friendly" | "challenge";
    remainingUndos: number;
    remainingHints: number;
}