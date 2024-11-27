import React from "react";
import { Chessboard } from "react-chessboard";
import "./ActiveGame.css";
import { ActiveGameProps } from "./ActiveGameTypes";

/**
 * ActiveGame component renders a chessboard with the current game state and allows users to interact with it.
 * It supports customizations such as orientation, hints, and styles. The component integrates with the
 * `react-chessboard` library to display the chessboard and manage interactions like piece drops.
 *
 * @component
 * @param {ActiveGameProps} props - The properties required for the ActiveGame component.
 * @param {string} props.fen - The current FEN (Forsyth-Edwards Notation) string representing the game state.
 * @param {(sourceSquare: string, targetSquare: string) => boolean} props.onDrop - Callback function triggered when a piece is dropped. Receives source and target squares as arguments.
 * @param {"w" | "b"} props.orientation - The orientation of the chessboard ("w" for white, "b" for black).
 * @param {[string, string] | null} [props.hint] - An optional hint represented as a tuple of start and end squares. If provided, an arrow is displayed on the board to show the hint.
 * @returns {JSX.Element} - The rendered ActiveGame component.
 */
export default function ActiveGame({
  fen,
  onDrop,
  orientation,
  hint
}: ActiveGameProps): JSX.Element {
  return (
    <div className="active-game">
      <div className="board">
        <Chessboard
          position={fen}
          onPieceDrop={onDrop}
          boardOrientation={orientation === "w" ? "white" : "black"}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
          customDarkSquareStyle={{ backgroundColor: '#AAAAAA' }}
          customLightSquareStyle={{ backgroundColor: '#FFFFFF' }}
          customArrows={hint ? [[hint[0], hint[1], "rgb(255, 205, 5)"]] : []}
        />
      </div>
    </div>
  );
}
