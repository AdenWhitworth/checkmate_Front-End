import { Square } from "chess.js";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

/**
 * Represents a chess puzzle stored in Firestore.
 *
 * @interface Puzzle
 * @property {string} puzzleTag - A unique identifier for the puzzle (e.g., "easy-001").
 * @property {string} fen - The Forsyth-Edwards Notation (FEN) string representing the initial chessboard state of the puzzle.
 * @property {string[]} moves - An array of moves in UCI format that represent the solution to the puzzle.
 * @property {number} rating - The difficulty rating of the puzzle, typically based on Elo.
 * @property {number} ratingDeviation - The deviation in the puzzle's rating, indicating its reliability.
 * @property {number} popularity - A score representing how popular the puzzle is among players.
 * @property {number} numberPlays - The number of times the puzzle has been attempted.
 * @property {string[]} themes - An array of themes or tags associated with the puzzle (e.g., "mateIn2", "endgame").
 * @property {string | null} openingTags - Tags describing the opening associated with the puzzle, or `null` if not applicable.
 * @property {"easy" | "medium" | "hard"} difficulty - The difficulty level of the puzzle.
 * @property {string} [puzzleId] - An optional unique identifier for the puzzle in Firestore.
 * @property {number} puzzleNumber - The sequential number of the puzzle within its difficulty level.
 */
export interface Puzzle {
  puzzleTag: string;
  fen: string;
  moves: string[];
  rating: number;
  ratingDeviation: number;
  popularity: number;
  numberPlays: number;
  themes: string[];
  openingTags: string | null;
  difficulty: "easy" | "medium" | "hard";
  puzzleId?: string;
  puzzleNumber: number;
}

/**
 * Represents the context values provided by the PuzzleProvider for managing puzzle games.
 *
 * @interface PuzzleContextType
 * @property {Puzzle | null} puzzle - The current puzzle data or `null` if no puzzle is loaded.
 * @property {(value: Puzzle | null) => void} setPuzzle - Function to update the current puzzle.
 * @property {"easy" | "medium" | "hard"} difficulty - The current difficulty level of the puzzle.
 * @property {(value: "easy" | "medium" | "hard") => void} setDifficulty - Function to update the puzzle difficulty.
 * @property {"w" | "b"} orientation - The player's orientation in the game ("w" for white, "b" for black).
 * @property {(value: "w" | "b") => void} setOrientation - Function to update the player's orientation.
 * @property {"w" | "b"} playerTurn - Indicates the current player's turn ("w" for white, "b" for black).
 * @property {(value: "w" | "b") => void} setPlayerTurn - Function to update the current player's turn.
 * @property {string} fen - The current FEN (Forsyth-Edwards Notation) string representing the game state.
 * @property {(value: string) => void} setFen - Function to update the current FEN string.
 * @property {string | null} puzzleOver - Indicates the completion status or result of the puzzle.
 * @property {(value: string | null) => void} setPuzzleOver - Function to update the puzzle completion state.
 * @property {boolean} loadingPuzzleOver - Indicates if the puzzle completion state is being processed.
 * @property {(value: boolean) => void} setLoadingPuzzleOver - Function to update the loading state for puzzle completion.
 * @property {string | null} errorPuzzleOver - Error message if puzzle completion fails, or `null` if no error.
 * @property {(value: string | null) => void} setErrorPuzzleOver - Function to set the error message for puzzle completion.
 * @property {boolean} loadingStartPuzzle - Indicates if a new puzzle is being loaded.
 * @property {(value: boolean) => void} setLoadingStartPuzzle - Function to update the loading state for starting a puzzle.
 * @property {string | null} errorStartPuzzle - Error message if starting a puzzle fails, or `null` if no error.
 * @property {(value: string | null) => void} setErrorStartPuzzle - Function to set the error message for starting a puzzle.
 * @property {string | null} successStartPuzzle - Success message when starting a puzzle successfully, or `null` if none.
 * @property {(value: string | null) => void} setSuccessStartPuzzle - Function to set the success message for starting a puzzle.
 * @property {(sourceSquare: Square, targetSquare: Square) => boolean} onDrop - Function to handle piece movement on the chessboard.
 * @property {(piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean} onPromotionPieceSelect - Function to handle pawn promotion.
 * @property {() => Promise<void>} handleCreatePuzzle - Function to start a new puzzle asynchronously.
 * @property {() => Promise<void>} handleClosePuzzle - Function to close the current puzzle asynchronously.
 * @property {() => Promise<void>} handleReconnectPuzzle - Function to reconnect to an ongoing puzzle asynchronously.
 * @property {boolean} reconnectPuzzle - Indicates if the puzzle is being reconnected.
 * @property {(value: boolean) => void} setReconnectPuzzle - Function to update the reconnect state of the puzzle.
 * @property {boolean} loadingReconnectPuzzle - Indicates if the reconnect process is in progress.
 * @property {(value: boolean) => void} setLoadingReconnectPuzzle - Function to update the loading state for reconnecting to a puzzle.
 * @property {string | null} errorReconnectPuzzle - Error message if reconnecting fails, or `null` if no error.
 * @property {(value: string | null) => void} setErrorReconnectPuzzle - Function to set the error message for reconnecting to a puzzle.
 * @property {number} timer - The current timer value, in seconds.
 * @property {() => void} resetPuzzle - Function to reset the puzzle state to its initial configuration.
 */
export interface PuzzleContextType {
  puzzle: Puzzle | null;
  setPuzzle: (value: Puzzle | null) => void;
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: (value: "easy" | "medium" | "hard") => void;
  orientation: "w" | "b";
  setOrientation: (value: "w" | "b") => void;
  playerTurn: "w" | "b";
  setPlayerTurn: (value: "w" | "b") => void;
  fen: string;
  setFen: (value: string) => void;
  puzzleOver: string | null;
  setPuzzleOver: (value: string | null) => void;
  loadingPuzzleOver: boolean;
  setLoadingPuzzleOver: (value: boolean) => void;
  errorPuzzleOver: string | null;
  setErrorPuzzleOver: (value: string | null) => void;
  loadingStartPuzzle: boolean;
  setLoadingStartPuzzle: (value: boolean) => void;
  errorStartPuzzle: string | null;
  setErrorStartPuzzle: (value: string | null) => void;
  successStartPuzzle: string | null;
  setSuccessStartPuzzle: (value: string | null) => void;
  onDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
  onPromotionPieceSelect: (piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean;
  handleCreatePuzzle: () => Promise<void>;
  handleClosePuzzle: () => Promise<void>;
  handleReconnectPuzzle: () => Promise<void>;
  reconnectPuzzle: boolean;
  setReconnectPuzzle: (value: boolean) => void;
  loadingReconnectPuzzle: boolean;
  setLoadingReconnectPuzzle: (value: boolean) => void;
  errorReconnectPuzzle: string | null;
  setErrorReconnectPuzzle: (value: string | null) => void;
  timer: number;
  resetPuzzle: () => void;
}
