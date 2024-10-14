import React from "react";
import { Chessboard } from "react-chessboard";
import { useGame } from "../../../Providers/GameProvider/GameProvider";
import Modal from "../../Modal/Modal";
import king_logo_black from "../../../Images/King Logo Black.svg";
import "./ActiveGame.css";
import { useChessGame } from "../../../Hooks/useChessGame/useChessGame";

export default function ActiveGame() {

  const { 
    orientation, 
    fen,
    gameOver,
  } = useGame();

  const { onDrop, handleSoccetCloseRoom } = useChessGame();

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
        
        {gameOver && <Modal 
          addButton={true} 
          buttonLabel={"Continue"} 
          styleType={"primary"} 
          addClose={false} 
          handleButtonClick={handleSoccetCloseRoom} 
          logoSrc={king_logo_black} 
          title={gameOver}
        ></Modal>}
      </div>
  );
}
