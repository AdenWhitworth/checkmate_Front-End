import { useState, useMemo, useCallback, useEffect, useContext } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import CustomDialog from "./components/CustomDialog";
import {GameContext} from "./components/DashboardCard";
import { db } from './firebase';
import { collection, doc, increment, updateDoc} from "firebase/firestore";

export default function ActiveGame({ username, setNetworkError, setNetworkReason, socket, forfeitGame, gameplayers, room, orientation, cleanup, setBadgeCSS, setFlagCSS, checkSendHome, userId, win, loss}) {
  const chess = useMemo(() => new Chess(), [room]);//have react memoize the new chess game instance only on first refresh. Each game does not require this to be updated. Only new games will trigger this to rememoize
  const [fen, setFen] = useState(chess.fen());//Forsyth-Edwards Notation used to describe chess piece locations as a string
  
  const [over, setOver] = useState("");//use to establish why the end game dialog was triggered
  const [overDialog, setOverDialog] = useState(false);//use to trigger the end game dialog 

  //useContext required to move the data laterally from the active game to the GameCard without triggering a rerender of the parent DashboardCard
  const {opponentUserId, opponentWin, opponentLoss, setPlayerTurn, setHistory, opponentUserName} = useContext(GameContext); //get oppenent information and set game history through this context. 
  
  //useCallback required to memoize the makeAMove function
  //this will only trigger a re-render of the function on a new chess game instance. As this chess instance is also memoized through useMemo, then the function will only be refreshed on a new game 
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
              `Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins!` //Player making last move is the winner
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

        socket.emit("move", { //emit a move event and establish a response callback 
            move,
            room,
        }, (response) => {
          if (response.error){//if there is an error, then return the piece and prompt the user to try again
            setNetworkError(true);
            setNetworkReason("Move");
            return false;//return of false will move the piece back to the previous square
          }
        });

        return true;//legal move allows for piece to move to ondrop square
    }

    useEffect(() => {
        //update board to show opponent move
        //Triggered by opponent onDrop soccet emit
        socket.on("move", (move, callback) => {//use the move data being passed to make a move for this client and estalish a callback 
          let error, message;
          try {
            const checkMove = makeAMove(move); //register opponent move

            // if unable to make the move
            if (checkMove === null){
              error = true;
              message = "move not made by opponent";
            } else {//the move was made
              error = false;
              message = "move made by opponent players";
            }

            
            callback({error,message});//set callback to tell other player that the move was successful or unsuccessful
          } catch(err){//tell other player move was not successful so that they can be prompted to try again
            error = true;
            message = err;
            callback({error,message});//set callback to tell other player that the move was unsuccessful
          }
          
          
        });
    }, [makeAMove]);

    useEffect(() => {
        //show over dialog as opponent disconnected and forfeits the game
        //Triggered by opponent disconnect soccet emit
        socket.on('playerDisconnected', (player) => {//use the player data to get the username of the player who disconnected
            setOver(`${player.username} has Forfeited`); //when a player disconnects, then they forfeit the game
            setOverDialog(true);
        });
    }, []);

    useEffect(() => {
      //show over dialog as opponen forfeits the game
      //Triggered by opponent disconnect soccet emit
      socket.on('playerForfeited', (player,callback) => {//use the player data to see who forfeited and establish a callback 
        let error, message;
        try {
          //set the game to be over with the opponent forfeiting
          setOver(player.username + " has Forfeited");
          setOverDialog(true);

          error = false;
          message = "player recieved forfeit";

          callback({error,message});//set callback to tell other player that their forfeit was recieved
        } catch (err) {
          let error = true;
          let message = err;

          callback({error,message});// set callback to tell other player their forfeit was not received 
        }
      });
    }, []);

    useEffect(() => {
      //triggered when end game button is clicked
      //reset the board to initial state and clean the game data
      //check to see if the user clicked the home button to end the game
      if (forfeitGame == true){
        socket.emit("playerForfeited", {roomId: room, username: username}, (response) => {//emit the room and player information and set response callback
          if (response.error){//if there is an error sending the forfeit to the other player then prompt them to try again
            setNetworkError(true);
            setNetworkReason("Forfeit");
          } else {//successfully forfeiting the game resets the board 
            setFen('start');
            cleanup();
            checkSendHome();//check to see if the player clicked the home button to leave the game. If so, then send them back to app.js
          }
        });
        
      }
    }, [forfeitGame]);

    function findWinner() {
      //Using the over description find out why the game ended
      //Using the board orientation determine which color the current player is
      //Corralate the description with board orientatino to see if current player or opponent won/lost
      var winner = "";
    
      if (over == "Checkmate! Black wins!"){
        if (orientation[0] == "white"){//player is white but winner was black
          winner = "opponent";
        }else {//player is white and winner is white
          winner = "player";
        }
      } else if (over == "Checkmate! White wins!") {
        if (orientation[0] == "white"){//player is white and winner is white
          winner = "player";
        }else {//player is black and winner is white
          winner = "opponent";
        }
      } else if (over == opponentUserName + " has Forfeited"){//if the opponent forfeits then player is the winner
          winner = "player";
      }
    
      return winner;//return the winner to be used later
    
    }

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
      
      //Find out who the winner is. Return a string of player or opponent
      let winner = findWinner();

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
                    
                    
                    let winner = findWinner();//see who won the game

                    if (winner === "player"){//To not repeat the close room, only have the winner close the room. This will also handle forfeiting as the winner is still connected to the socket
                      
                      handleWinLossChange();//update the win/loss to the database

                      socket.emit("closeRoom", {roomId: room}, (response) => {//emit closeRoom in order to tell server to close all socket connections to the room being passed
                        if (response.error){//if there is an error closing the room, then prompt user to retry
                          setNetworkError(true);
                          setNetworkReason("End");
                          return
                        }
                      });
                    }
                    //reset the board
                    setFen('start');
                    cleanup();
                    setOverDialog(false);//close the CustomDialog

                }}
            />

        </div>
    );
}
