import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./components/CustomDialog";
import {GameContext} from "./components/DashboardCard";
import { db } from './firebase';
import { collection, doc, increment, updateDoc} from "firebase/firestore";

export default function ActiveGame({ username, setNetworkError, setNetworkReason, socket, forfeitGame, gameplayers, room, orientation, cleanup, setBadgeCSS, setFlagCSS, checkSendHome, userId, win, loss}) {
  const chess = useMemo(() => new Chess(), [room]);
  const [fen, setFen] = useState(chess.fen());
  const [over, setOver] = useState("");
  const [overDialog, setOverDialog] = useState(false); 

  const {opponentUserId, opponentWin, opponentLoss, setPlayerTurn, setHistory, opponentUserName} = useContext(GameContext);
  
  const makeAMove = useCallback(
    (move) => {
      try {
        const result = chess.move(move);
        setFen(chess.fen());
        
        setHistory(chess.history({verbose: true}));
        setPlayerTurn(chess.turn());
  
        if (chess.isGameOver()) {
          if (chess.isCheckmate()) {
            setOver(
              `Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins!`
            ); 
            setOverDialog(true);

          } else if (chess.isDraw()) {
            setOver("Draw");
            setOverDialog(true); 
          } else { 
            setOver("Game over");
            setOverDialog(true);
          }
        }
  
        return result;
      } catch (e) {
        return null;
      } 
    },
    [chess]
  );

  function onDrop(sourceSquare, targetSquare) {
      if (chess.turn() !== orientation[0]) return false;

      if (gameplayers.length < 2) return false;

      const moveData = {
          from: sourceSquare,
          to: targetSquare,
          color: chess.turn(),
          promotion: "q",
      };

      const move = makeAMove(moveData);

      if (move === null) return false;

      socket.emit("move", {
          move,
          room,
      }, (response) => {
        if (response.error){
          setNetworkError(true);
          setNetworkReason("Move");
          return false;
        }
      });

      return true;
  }

  const handleSoccetMove = () => {
    socket.on("move", (move, callback) => {
      let error, message;
      try {
        const checkMove = makeAMove(move);

        if (checkMove === null){
          error = true;
          message = "move not made by opponent";
        } else {
          error = false;
          message = "move made by opponent players";
        }

        
        callback({error,message});
      } catch(err){
        error = true;
        message = err;
        callback({error,message});
      }
      
    });
  }

  const handleSoccetPlayerDisconnect = () => {
    socket.on('playerDisconnected', (player) => {
      setOver(`${player.username} has Forfeited`);
      setOverDialog(true);
    });
  }

  const handleSoccetPlayerForfeited = () => {
    socket.on('playerForfeited', (player,callback) => {
      let error, message;
      try {
        setOver(player.username + " has Forfeited");
        setOverDialog(true);

        error = false;
        message = "player recieved forfeit";

        callback({error,message});
      } catch (err) {
        let error = true;
        let message = err;

        callback({error,message});
      }
    });
  }

  const handleForfeitGame = () => {
    if (forfeitGame == true){
      socket.emit("playerForfeited", {roomId: room, username: username}, (response) => {
        if (response.error){
          setNetworkError(true);
          setNetworkReason("Forfeit");
        } else {
          setFen('start');
          cleanup();
          checkSendHome();
        }
      });
      
    }
  }

  function findWinner() {
    var winner = "";
  
    if (over == "Checkmate! Black wins!"){
      if (orientation[0] == "white"){
        winner = "opponent";
      }else {
        winner = "player";
      }
    } else if (over == "Checkmate! White wins!") {
      if (orientation[0] == "white"){
        winner = "player";
      }else {
        winner = "opponent";
      }
    } else if (over == opponentUserName + " has Forfeited"){
        winner = "player";
    }
  
    return winner;
  
  }

  const handleWinLossChange = async () => {
    const userCollection = collection(db, 'users');
    const DocRef = doc(userCollection, userId);
    const DocRefOpponent = doc(userCollection, opponentUserId);

    const rank = win * win / (win + loss);
    const rankOpponent = opponentWin * opponentWin / (opponentWin + opponentLoss);
    
    let winner = findWinner();

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

  const handleSoccetCloseRoom = () => {
    let winner = findWinner();

    if (winner === "player"){
      
      handleWinLossChange();
      socket.emit("closeRoom", {roomId: room}, (response) => {
        if (response.error){
          setNetworkError(true);
          setNetworkReason("End");
          return
        }
      });
    }
    
    setFen('start');
    cleanup();
    setOverDialog(false);
  }

  useEffect(() => {
    handleSoccetMove();
  }, [makeAMove]);
  
  useEffect(() => {
    handleSoccetPlayerDisconnect();
  }, []);

  useEffect(() => {
    handleSoccetPlayerForfeited();
  }, []);

  useEffect(() => {
    handleForfeitGame();
  }, [forfeitGame]);
      
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

            <CustomDialog
                open={overDialog}
                title={over}
                handleContinue={handleSoccetCloseRoom}
            />

        </div>
    );
}
