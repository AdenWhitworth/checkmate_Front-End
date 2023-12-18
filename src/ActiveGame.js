import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import socket from "./socket";
import CustomDialog from "./components/CustomDialog";
import {GameContext} from "./components/DashboardCard";
import { db } from './firebase';
import { collection, doc, increment, updateDoc} from "firebase/firestore";

export default function ActiveGame({forfeitGame, gameplayers, room, orientation, cleanup, setBadgeCSS, setFlagCSS, checkSendHome, opponentUserName, userId, win, loss}) {
  const chess = useMemo(() => new Chess(), []);
  const [fen, setFen] = useState(chess.fen());
  
  const [over, setOver] = useState("");
  const [overDialog, setOverDialog] = useState(false);

  const {opponentUserId, opponentWin, opponentLoss, setPlayerTurn, setHistory} = useContext(GameContext);
  

  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move); // update Chess instance
        setFen(chess.fen()); // update fen state to trigger a re-render
        
        setHistory(chess.history({verbose: true})); // update history state to trigger re-render of GameCard
        setPlayerTurn(chess.turn()); // update player turn state to trigger re-render of GameCard
  
        if (chess.isGameOver()) { // check if move led to "game over"
          if (chess.isCheckmate()) { // if reason for game over is a checkmate
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "black" : "white"} wins!` //Player making last move is the winner
            ); 
            setOverDialog(true);

          } else if (chess.isDraw()) { // if it is a draw
            setOver("Draw");
            setOverDialog(true); 
          } else { //handle any other reason for game over 
            setOver("Game over");
            setOverDialog(true);
          }
        }
  
        return result;
      } catch (e) {
        return null; // null if the move was illegal
      } 
    },
    [chess]
  );

    // onDrop function called when a piece is dropped
    function onDrop(sourceSquare, targetSquare) {
        if (chess.turn() !== orientation[0]) return false; //prohibit player from moving piece of other player

        if (gameplayers.length < 2) return false; //disallow a move if the opponent has not joined the game

        //format move information for chess.js api
        const moveData = {
            from: sourceSquare,
            to: targetSquare,
            color: chess.turn(),
            promotion: "q",
        };

        const move = makeAMove(moveData); //make a move use makeAMove function

        // illegal move returns piece to original square
        if (move === null) return false;

        socket.emit("move", { //emit a move event.
            move,
            room,
        });

        return true;//legal move allows for piece to move to ondrop square
    }

    useEffect(() => {
        //update board to show opponent move
        //Triggered by opponent onDrop soccet emit
        socket.on("move", (move) => {
          makeAMove(move); //
        });
    }, [makeAMove]);

    useEffect(() => {
        //show over dialog as opponent disconnected and forfeits the game
        //Triggered by opponent disconnect soccet emit
        socket.on('playerDisconnected', (player) => {
            setOver(`${player.username} has Forfeited`); 
            setOverDialog(true);
        });
    }, []);

    useEffect(() => {
      //triggered when end game button is clicked
      //reset the board to initial state and clean the game data
      //check to see if the user clicked the home button to end the game
      if (forfeitGame == true){
        socket.emit("closeRoom", {roomId: room});
        setFen('start');
        cleanup();
        checkSendHome();
      }
  }, [forfeitGame]);

    useEffect(() => {
        //show over dialog as opponent forfeits the game
        //Triggered by opponent closeroom soccet emit
        socket.on('closeRoom', ({ roomId }) => {
          if (roomId === room) {
            setOver(`${opponentUserName} has Forfeited`);
            setOverDialog(true);
            setFlagCSS('end-game-flag hideNavButton');
            setBadgeCSS('notification showNavButton');
          }
        });
    }, [room, cleanup]);

    const handleWinLossChange = async () => {
      //Check to see who won and lost the game

      //Initialize Firebase collection and documents to update
      const userCollection = collection(db, 'users');
      const DocRef = doc(userCollection, userId);
      const DocRefOpponent = doc(userCollection, opponentUserId);

      //Calculate current player rank and opponent rank 
      //Rank is weighted based on the number of games played
      const rank = win * win / (win + loss);
      const rankOpponent = opponentWin * opponentWin / (opponentWin + opponentLoss);
      
      //Using the over description find out why the game ended
      //Using the board orientation determine which color the current player is
      //Corralate the description with board orientatino to see if current player or opponent won/lost
      var winner = "";
      if (over == "Checkmate! black wins!"){
        if (orientation[0] == "white"){
          winner = "player";
        }else {
          winner = "opponent";
        }
      } else if (over == "Checkmate! white wins!") {
        if (orientation[0] == "white"){
          winner = "player";
        }else {
          winner = "opponent";
        }
      } else if (over == opponentUserName + " has Forfeited"){
        if (orientation[0] == "white"){
          winner = "player";
        }else {
          winner = "opponent";
        }
      }

      //update both the current player and opponent players win/loss and rank
      if (winner = "player"){
        await updateDoc(DocRef, {
          win: increment(1),
          rank: rank,
        });

        await updateDoc(DocRefOpponent, {
          loss: increment(1),
          rank: rankOpponent,
        });

      } else {
        await updateDoc(DocRefOpponent, {
          win: increment(1),
          rank: rankOpponent,
        });

        await updateDoc(DocRef, {
          loss: increment(1),
          rank: rank,
        });
      }
      
    }
      
    return (
        <div class="active-game">
            
            <div className="board">
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
                    //Have only the player who won the game update the win/loss database update
                    //ensure socket room is closed
                    //reset the board to initial state and clean the game data
                    //close the CustomDialog when continue button is clicked.
                    handleWinLossChange();
                    socket.emit("closeRoom", { roomId: room });
                    setFen('start');
                    cleanup();
                    setOverDialog(false);
                }}
            />

        </div>
    );
}
