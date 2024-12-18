import { useCallback, useEffect, useState, useRef } from "react";
import { Square, PieceSymbol } from "chess.js";
import { UsePuzzleChessGameOutput, UsePuzzleChessGameProps } from "./usePuzzleChessGameTypes";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

/**
 * Custom hook to manage a chess puzzle game.
 *
 * Provides logic for move validation, opponent moves, puzzle resets, and timer management.
 *
 * @param {UsePuzzleChessGameProps} props - The properties required to manage the chess puzzle.
 * @param {Puzzle | null} props.puzzle - The current puzzle object containing FEN and moves.
 * @param {"w" | "b"} props.orientation - The player's orientation ("w" for white, "b" for black).
 * @param {(value: "w" | "b") => void} props.setOrientation - Function to update the player's orientation.
 * @param {Chess} props.chess - An instance of the `Chess` class for game logic.
 * @param {(value: string) => void} props.setFen - Function to update the current FEN string.
 * @param {(value: string | null) => void} props.setPuzzleOver - Function to update the puzzle-over state.
 * @param {(value: "w" | "b") => void} props.setPlayerTurn - Function to update the current player's turn.
 * @param {(value: number | ((prev: number) => number)) => void} props.setTimer - Function to update the timer value.
 *
 * @returns {UsePuzzleChessGameOutput} - Functions to manage the chess puzzle:
 *   - `onDrop`: Handles piece drops (non-promotion moves).
 *   - `onPromotionPieceSelect`: Handles pawn promotion moves.
 *   - `resetPuzzle`: Resets the puzzle to its initial state.
 */
export const usePuzzleChessGame = ({
  puzzle,
  orientation,
  setOrientation,
  chess,
  setFen,
  setPuzzleOver,
  setPlayerTurn,
  setTimer,
}: UsePuzzleChessGameProps): UsePuzzleChessGameOutput => {
  const [, setCurrentMoveIndex] = useState<number>(1); // Player's move starts at index 1
  const OPPONENT_MOVE_DELAY = 1000; // Delay in milliseconds (1 second)

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Starts or resets the timer to 0 and begins counting up.
   */
  const resetAndStartTimer = useCallback(() => {
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
  }, [setTimer]);

  /**
   * Stops the game timer.
   */
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Clears any pending opponent move timeouts.
   */
  const cleanupTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  /**
   * Simulates the opponent's move after a delay.
   *
   * @param {number} index - The current move index for the opponent.
   */
  const makeOpponentMove = useCallback(
    (index: number) => {
      if (!puzzle || index >= puzzle.moves.length) return;

      cleanupTimeout();
      timeoutRef.current = setTimeout(() => {
        chess.move(puzzle.moves[index]);
        setFen(chess.fen());
        setPlayerTurn(chess.turn());
        setCurrentMoveIndex(index + 1);
      }, OPPONENT_MOVE_DELAY);
    },
    [chess, puzzle, setFen, setPlayerTurn, cleanupTimeout]
  );

  /**
   * Handles a player's move and validates it against the expected puzzle move.
   *
   * @param {string} move - The player's move in UCI (Universal Chess Interface) format.
   */
  const makeAMove = useCallback(
    (move: string) => {
      setCurrentMoveIndex((prevIndex) => {
        if (!puzzle || prevIndex >= puzzle.moves.length) {
          setPuzzleOver("Puzzle is already completed!");
          stopTimer();
          return prevIndex;
        }

        const expectedMove = puzzle.moves[prevIndex];
        if (move !== expectedMove) {
          setPuzzleOver("Incorrect move! Puzzle over.");
          stopTimer();
          return prevIndex;
        }

        chess.move(move);
        setFen(chess.fen());
        setPlayerTurn(chess.turn());

        const nextIndex = prevIndex + 1;
        if (nextIndex >= puzzle.moves.length) {
          setPuzzleOver("Congratulations! You've completed the puzzle.");
          stopTimer();
        } else {
          makeOpponentMove(nextIndex);
        }

        return nextIndex;
      });
    },
    [chess, puzzle, setFen, setPlayerTurn, setPuzzleOver, stopTimer, makeOpponentMove]
  );

  /**
   * Handles a piece drop event (non-promotion moves).
   *
   * @param {Square} sourceSquare - The starting square of the move.
   * @param {Square} targetSquare - The ending square of the move.
   * @returns {boolean} - Returns true if the move was valid, otherwise false.
   */
  const onDrop = useCallback(
    (sourceSquare: Square, targetSquare: Square): boolean => {
      if (chess.turn() !== orientation) return false;
      if (!puzzle) return false;

      const playerMove = `${sourceSquare}${targetSquare}`;
      makeAMove(playerMove);
      return true;
    },
    [chess, orientation, puzzle, makeAMove]
  );

  /**
   * Handles pawn promotion moves.
   *
   * @param {PromotionPieceOption} [piece] - The promoted piece type.
   * @param {Square} [promoteFromSquare] - The starting square of the move.
   * @param {Square} [promoteToSquare] - The ending square of the move.
   * @returns {boolean} - Returns true if the move was valid, otherwise false.
   */
  const onPromotionPieceSelect = useCallback(
    (piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square): boolean => {
      if (chess.turn() !== orientation) return false;
      if (!puzzle || !piece || !promoteFromSquare || !promoteToSquare) return false;

      const promotionPieceType = piece.slice(1).toLowerCase() as PieceSymbol;
      const playerMove = `${promoteFromSquare}${promoteToSquare}${promotionPieceType}`;
      makeAMove(playerMove);
      return true;
    },
    [chess, puzzle, orientation, makeAMove]
  );

  /**
   * Shared function to initialize or reset the puzzle.
   */
  const initializePuzzle = useCallback(() => {
    if (!puzzle) return;

    stopTimer();
    setTimer(0);
    cleanupTimeout();

    chess.load(puzzle.fen);
    setOrientation(chess.turn() === "w" ? "b" : "w");
    setFen(chess.fen());
    setPlayerTurn(chess.turn());
    setPuzzleOver(null);
    setCurrentMoveIndex(1);
    makeOpponentMove(0);
    resetAndStartTimer();
  }, [puzzle, stopTimer, setTimer, cleanupTimeout, chess, setOrientation, setFen, setPlayerTurn, setPuzzleOver, makeOpponentMove, resetAndStartTimer]);

  /**
   * Resets the puzzle to its initial state.
   */
  const resetPuzzle = useCallback(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  /**
   * Initializes the puzzle when it loads.
   */
  useEffect(() => {
    initializePuzzle();

    return () => {
      cleanupTimeout();
      stopTimer();
    };
  }, [puzzle, initializePuzzle, cleanupTimeout, stopTimer]);

  return {
    onDrop,
    onPromotionPieceSelect,
    resetPuzzle,
  };
};