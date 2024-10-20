import React from "react";
import { Chessboard } from "react-chessboard";
import { useGame } from "../../../Providers/GameProvider/GameProvider";
import "./ActiveGame.css";

/**
 * ActiveGame component renders a chessboard with current game state and allows users to interact with it.
 * It utilizes the `useGame` provider to get the current state of the chess game, including the FEN string,
 * the player's orientation, and the function to handle piece drops.
 *
 * @component
 * @returns {JSX.Element} - A component that renders the chessboard and game interactions.
 */
export default function ActiveGame(): JSX.Element {
  const { orientation, fen, onDrop } = useGame();

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
        />
      </div>
    </div>
  );
}
