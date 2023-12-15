import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "./socket";
import CustomDialog from "./components/CustomDialog";
import {GameContext} from "./components/DashboardCard";

export default function ActiveGame({forfeitGame, gameplayers, room, orientation, cleanup, setBadgeCSS, setFlagCSS, checkSendHome, opponentUserName}) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  
  const [over, setOver] = useState("");
  const [overDialog, setOverDialog] = useState(false);

  const {setPlayerTurn, setHistory} = useContext(GameContext);

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render
        
        setHistory(chess.history({verbose: true}));
        setPlayerTurn(chess.turn());
  
        console.log("over, checkmate", chess.isGameOver(), chess.isCheckmate());
  
        if (chess.isGameOver()) { // check if move led to "game over"
          if (chess.isCheckmate()) { // if reason for game over is a checkmate
            // Set message to checkmate. 
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!`
            ); 
            setOverDialog(true);
            // The winner is determined by checking which side made the last move
          } else if (chess.isDraw()) { // if it is a draw
            setOver("Draw"); // set message to "Draw"
            setOverDialog(true);
          } else {
            setOver("Game over");
            setOverDialog(true);
          }
        }
  
        return result;
      } catch (e) {
        return null;
      } // null if the move was illegal, the move object if the move was legal
    },
    [chess]
  );

    // onDrop function
    function onDrop(sourceSquare, targetSquare) {
        // orientation is either 'white' or 'black'. game.turn() returns 'w' or 'b'
        if (chess.turn() !== orientation[0]) return false; // <- 1 prohibit player from moving piece of other player

        if (gameplayers.length < 2) return false; // <- 2 disallow a move if the opponent has not joined

        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            promotion: "q", // promote to queen where possible
        };

        const move = makeAMove(moveData);

        // illegal move
        if (move === null) return false;

        socket.emit("move", { // <- 3 emit a move event.
            move,
            room,
        }); // this event will be transmitted to the opponent via the server

        return true;
    }

    useEffect(() => {
        socket.on("move", (move) => {
          makeAMove(move); //
        });
    }, [makeAMove]);

    useEffect(() => {
        socket.on('playerDisconnected', (player) => {
            console.log("socket opponent",player.username);
            setOver(`${player.username} has disconnected`); // set game over
            setOverDialog(true);
        });
    }, []);

    useEffect(() => {
      //when end game button is clicked
      if (forfeitGame == true){
        socket.emit("closeRoom", {roomId: room});
        setFen('start');
        cleanup();
        checkSendHome();
      }
  }, [forfeitGame]);

    useEffect(() => {
        socket.on('closeRoom', ({ roomId }) => {
          if (roomId === room) {
            setOver(`${opponentUserName} has Forfeited`); // set game over
            setOverDialog(true);
            setFlagCSS('end-game-flag hideNavButton');
            setBadgeCSS('notification showNavButton');
          }
        });
    }, [room, cleanup]);

      
    return (
        <div class="active-game">
            
            <div className="board" style={{
              
              /*
              width: '100%',
              */
            
            }}>
            <Chessboard
            position={fen}
            onPieceDrop={onDrop}
            boardOrientation={orientation}
            customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customDarkSquareStyle={{backgroundColor: '#AAAAAA'}}
            customLightSquareStyle={{backgroundColor: '#FFFFFF'}}
            />
            </div>

            <CustomDialog // Game Over CustomDialog
                open={overDialog}
                title={over}
                handleContinue={() => {
                    socket.emit("closeRoom", { roomId: room });
                    setFen('start');
                    cleanup();
                    setOverDialog(false);
                }}
            />

        </div>
    );
}
