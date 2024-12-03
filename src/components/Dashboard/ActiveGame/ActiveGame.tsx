import React from "react";
import { Chessboard } from "react-chessboard";
import "./ActiveGame.css";
import { ActiveGameProps } from "./ActiveGameTypes";

/**
 * ActiveGame component renders a chessboard with the current game state and allows users to interact with it.
 * It supports customizations such as orientation, hints, move highlighting, and promotion piece selection.
 * The component integrates with the `react-chessboard` library to display the chessboard and manage interactions
 * like piece drops, square clicks, and promotions.
 *
 * @component
 * @param {ActiveGameProps} props - The properties required for the ActiveGame component.
 * @param {string} props.fen - The current FEN (Forsyth–Edwards Notation) string representing the game state.
 * @param {(sourceSquare: string, targetSquare: string) => boolean} props.onDrop - Callback function triggered when a piece is dropped. Receives the source and target squares as arguments. Returns `true` if the move is valid, `false` otherwise.
 * @param {"w" | "b"} props.orientation - The orientation of the chessboard, indicating which side the player is viewing from ("w" for white, "b" for black).
 * @param {[string, string] | null} [props.hint] - An optional hint represented as a tuple of start and end squares. If provided, an arrow is displayed on the board to indicate the suggested move.
 * @param {(square: string) => void} [props.onSquareClick] - Callback function triggered when a square is clicked. Receives the clicked square as an argument.
 * @param {Record<string, any>} [props.highlightedSquares] - An optional object defining custom styles for specific squares. Keys are square coordinates, and values are style objects.
 * @param {(piece: string, from: string, to: string) => void} [props.onPromotionPieceSelect] - Callback function triggered when a pawn promotion occurs. Receives the selected promotion piece, the starting square, and the promotion square.
 * @returns {JSX.Element} - The rendered ActiveGame component.
 */
export default function ActiveGame({
  fen,
  onDrop,
  orientation,
  hint,
  onSquareClick,
  highlightedSquares,
  onPromotionPieceSelect
}: ActiveGameProps): JSX.Element {
  return (
    <div className="active-game">
      <div className="board">
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardOrientation={orientation === "w" ? "white" : "black"}
          onSquareClick={onSquareClick}
          customSquareStyles={highlightedSquares}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customDarkSquareStyle={{ backgroundColor: '#AAAAAA' }}
          customLightSquareStyle={{ backgroundColor: '#FFFFFF' }}
          customArrows={hint ? [[hint[0], hint[1], "rgb(255, 205, 5)"]] : []}
          onPromotionPieceSelect={onPromotionPieceSelect}
        />
      </div>
    </div>
  );
}