import { Move } from "chess.js";
import { GameMoves } from "../InGameStatsTypes";

/**
 * Represents the properties required for the history moves component,
 * which displays and manages the history of moves in a chess game.
 *
 * @interface HistoryMovesProps
 * @property {Move[]} history - An array of moves representing the chronological move history
 *                              of the chess game. Each move includes detailed information 
 *                              such as source, target, and move type.
 * @property {GameMoves[]} gameMoves - A structured array of game moves used for rendering 
 *                                     and managing the display of moves in the UI.
 * @property {(value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void} setGameMoves - 
 *                              A function to update the `gameMoves` state. Accepts either a new
 *                              array of `GameMoves` or a callback function that returns the updated
 *                              `GameMoves` based on the previous state.
 */
export interface HistorMovesProps{
    history: Move[];
    gameMoves: GameMoves[];
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
}