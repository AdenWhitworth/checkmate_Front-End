import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { Game } from "../../Providers/GameProvider/GameProviderTypes";
import { Move, Chess, Square } from "chess.js";

/**
 * Interface defining the properties passed to the `useBotChessGame` hook.
 *
 * @interface UseChessGameProps
 * @property {Game | null} game - The current game information.
 * @property {function} setGame - Function to set the current game information.
 * @property {function} setHistory - Function to set the move history of the game.
 * @property {function} setPlayerTurn - Function to set the current player's turn ("w" or "b").
 * @property {"w" | "b"} orientation - The orientation of the current player ("w" for white, "b" for black).
 * @property {Chess} chess - The chess.js instance managing the game logic.
 * @property {function} setFen - Function to set the current FEN notation of the game.
 * @property {string | null} gameOver - The status of the game if it is over, or null if the game is ongoing.
 * @property {function} setGameOver - Function to set the game over status message.
 * @property {function} setErrorMove - Function to set the error message if a move fails.
 * @property {function} setGameMoves - Function to set the current state of game moves. Accepts a new array of moves or a function that returns an updated array.
 */
export interface UseBotChessGameProps {
    game: Game | null;
    setGame: (game: Game | null) => void;
    setHistory: (value: Move[]) => void;
    setPlayerTurn: (value: "w" | "b") => void;
    orientation: "w" | "b";
    chess: Chess;
    setFen: (value: string) => void;
    gameOver: string | null;
    setGameOver: (value: string | null) => void;
    setErrorMove: (value: string | null) => void;
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
}

/**
 * Interface defining the output of the `useBotChessGame` hook.
 *
 * @interface UseBotChessGameOutput
 * @property {function} onDrop - Handles the drop action when a player moves a piece on the board.
 * @param {Square} sourceSquare - The source square of the piece being moved.
 * @param {Square} targetSquare - The target square of the piece being moved.
 * @returns {boolean} - Returns true if the move was successful, false otherwise.
 */
export interface UseBotChessGameOutput {
    onDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
}