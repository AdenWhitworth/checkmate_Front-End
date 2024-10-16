import React from "react";
import { Chessboard } from "react-chessboard";
import { useGame } from "../../../Providers/GameProvider/GameProvider";
import "./ActiveGame.css";

export default function ActiveGame() {

  const { 
    orientation, 
    fen,
    onDrop,
  } = useGame();

  return (
      <div className="active-game">
        <div className="board">
          <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation === "w"? "white" : "black"}
            customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customDarkSquareStyle={{backgroundColor: '#AAAAAA'}}
            customLightSquareStyle={{backgroundColor: '#FFFFFF'}}
          />
        </div>
      </div>
  );
}
