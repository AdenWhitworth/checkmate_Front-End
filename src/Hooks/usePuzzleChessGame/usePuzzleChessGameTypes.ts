import { Chess, Square } from "chess.js";
import { Puzzle } from "../../Providers/PuzzleProvider/PuzzleProviderTypes";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

/**
 * Props for the `usePuzzleChessGame` hook.
 *
 * @interface UsePuzzleChessGameProps
 * @property {Puzzle | null} puzzle - The current puzzle data, or `null` if no puzzle is loaded.
 * @property {"w" | "b"} orientation - The player's orientation in the game ("w" for white, "b" for black).
 * @property {(value: "w" | "b") => void} setOrientation - Function to update the player's orientation.
 * @property {Chess} chess - An instance of the `Chess` class to manage the game logic.
 * @property {(value: string) => void} setFen - Function to update the FEN (Forsyth-Edwards Notation) string representing the game state.
 * @property {(value: string | null) => void} setPuzzleOver - Function to set the state indicating whether the puzzle is over (e.g., success or failure).
 * @property {(value: "w" | "b") => void} setPlayerTurn - Function to update the current player's turn ("w" for white, "b" for black).
 * @property {(value: number | ((prev: number) => number)) => void} setTimer - Function to update the timer value, which can accept a number or a callback function.
 */
export interface UsePuzzleChessGameProps {
    puzzle: Puzzle | null;
    orientation: "w" | "b";
    setOrientation: (value: "w" | "b") => void;
    chess: Chess;
    setFen: (value: string) => void;
    setPuzzleOver: (value: string | null) => void;
    setPlayerTurn: (value: "w" | "b") => void;
    setTimer: (value: number | ((prev: number) => number)) => void;
}

/**
 * Output returned by the `usePuzzleChessGame` hook.
 *
 * @interface UsePuzzleChessGameOutput
 * @property {(sourceSquare: Square, targetSquare: Square) => boolean} onDrop - Handles player moves on the board. Returns `true` if the move is valid, otherwise `false`.
 * @property {(piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean} onPromotionPieceSelect - Handles pawn promotion moves. Returns `true` if the promotion is valid, otherwise `false`.
 * @property {() => void} resetPuzzle - Resets the current puzzle state, including the timer, move history, and FEN.
 */
export interface UsePuzzleChessGameOutput {
    onDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
    onPromotionPieceSelect: (piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean;
    resetPuzzle: () => void;
}