import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { Game, Opponent } from "../../Providers/GameProvider/GameProviderTypes";
import { Move, Chess, Square } from "chess.js";

/**
 * Interface defining the properties passed to the `useChessGame` hook.
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
 * @property {Opponent | null} opponent - The current opponent's information, or null if no opponent is present.
 * @property {function} setErrorMove - Function to set the error message if a move fails.
 * @property {function} setGameMoves - Function to set the current state of game moves. Accepts a new array of moves or a function that returns an updated array.
 * @property {function} setIsOpponentDisconnected - Function to set the disconnect/reconnect message.
 */
export interface UseChessGameProps {
    game: Game | null;
    setGame: (game: Game | null) => void;
    setHistory: (value: Move[]) => void;
    setPlayerTurn: (value: "w" | "b") => void;
    orientation: "w" | "b";
    chess: Chess;
    setFen: (value: string) => void;
    gameOver: string | null;
    setGameOver: (value: string | null) => void;
    opponent: Opponent | null;
    setErrorMove: (value: string | null) => void;
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
    setIsOpponentDisconnected: (value: string | null) => void;
}

/**
 * Interface defining the output of the `useChessGame` hook.
 *
 * @interface UseChessGameOutput
 * @property {function} onDrop - Handles the drop action when a player moves a piece on the board.
 * @param {Square} sourceSquare - The source square of the piece being moved.
 * @param {Square} targetSquare - The target square of the piece being moved.
 * @returns {boolean} - Returns true if the move was successful, false otherwise.
 *
 * @param {"player" | "opponent" | null} winner - The winner of the game ("player" or "opponent"), or null if no winner.
 * @returns {Promise<void>}
 *
 * @property {function} findWinner - Determines the winner of the game based on the game over state.
 * @returns {"playerA" | "playerB" | "draw" | null} - Returns "player" or "opponent" if there is a winner, or null if there is no winner.
 */
export interface UseChessGameOutput {
    onDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
    findWinner: () => "playerA" | "playerB" | "draw" | null
}
