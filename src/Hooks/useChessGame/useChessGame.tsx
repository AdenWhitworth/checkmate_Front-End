import { useCallback, useEffect, useState } from "react";
import { Move, Square } from "chess.js";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { useSocket, handleCallback } from "../../Providers/SocketProvider/SocketProvider";
import { MoveArgs, ForfeitArgs, DisconnectArgs, JoinRoomArgs } from "../../Providers/SocketProvider/SocketProviderTypes";
import { db } from '../../firebase';
import { collection, doc, increment, updateDoc} from "firebase/firestore";
import { UseChessGameProps } from "./useChessGameTypes";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";

export const useChessGame = ({ 
  room,
  setRoom, 
  setHistory, 
  setPlayerTurn, 
  orientation, 
  chess, 
  setFen,
  gameOver, 
  setGameOver,
  opponent,
  setErrorMove,
  setGameMoves
}: UseChessGameProps) => {
  const { player } = usePlayer();
  const { sendMove, socketRef } = useSocket();
  
  const makeAMove = useCallback((move: Move) => {
    try {
      const result = chess.move(move);
      setFen(chess.fen());
      setHistory(chess.history({verbose: true}));
      setPlayerTurn(chess.turn());

      if (chess.isGameOver()) {
        if (chess.isCheckmate()) {
          setGameOver(`Checkmate! ${chess.turn() === "w" ? "Black" : "White"} wins!`); 
        } else if (chess.isDraw()) {
          setGameOver("Draw");
        } else {
          setGameOver("Game over");
        }
      }
      return result;
    } catch (e) {
      return null;
    }
  }, [chess, setFen, setHistory, setPlayerTurn, setGameOver]);

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (chess.turn() !== orientation) return false;
    if (!room || room.players.length < 2) return false;
    
    const currentFen = chess.fen();

    const moveData: Move = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      piece: chess.get(sourceSquare)?.type || "",
      promotion: targetSquare.endsWith("8") || targetSquare.endsWith("1") ? "q" : undefined,
      flags: "",
      san: "",
      lan: "",
      before: "",
      after: ""
    };
  
    const move: Move | null = makeAMove(moveData);
    if (!move) return false;

    sendMoveAsync(move, currentFen);

    return true;
  };

  const sendMoveAsync = async (move: Move, previousFen: string) => {
    try {
      if (!room) throw Error("Room required.");
      await sendMove({ room, move });
    } catch (error) {
      chess.load(previousFen);
      setFen(previousFen);

      setGameMoves((prevMoves: GameMoves[]) => {
        const updatedMoves = [...prevMoves];
        if (updatedMoves.length > 0) {
          const lastMove = updatedMoves[updatedMoves.length - 1];
          if (!lastMove.rowMoves.blackMove) {
            updatedMoves.pop();
          } else {
            lastMove.rowMoves.blackMove = "";
          }
        }
        return updatedMoves;
      });
      
      setHistory(chess.history({ verbose: true }));
      setPlayerTurn(chess.turn());
      setErrorMove("Move failed, reverting to previous state and please try again.");
    }
  };
  
  const handleMove = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('recieveMove');
      socketRef.current.on('recieveMove', (moveArgs: MoveArgs, callback: Function) => {
        try {
          const checkMove = makeAMove(moveArgs.move);
          let message = !checkMove ? "Move not made by opponent" : "Move successfully made by opponent";
          handleCallback(callback, message);
        } catch (error) {
          handleCallback(callback, "Error processing move");
        }
      });
    }
  }, [makeAMove, socketRef]);

  const handleDisconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('playerDisconnected');
      socketRef.current.on('playerDisconnected', (disconnectArgs: DisconnectArgs) => {
        setGameOver(`${disconnectArgs.player.username} has Forfeited`);
      });
    }
  }, [setGameOver, socketRef]);

  const handlePlayerForfeited = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('playerForfeited');
      socketRef.current.on('playerForfeited', (forfeitArgs: ForfeitArgs, callback: Function) => {
        setGameOver(`${forfeitArgs.username} has Forfeited`);
        handleCallback(callback, "Opponent player received the forfeit");
      });
    }
  }, [setGameOver, socketRef]);

  const handleOpponentJoined = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('opponentJoined');
      socketRef.current.on('opponentJoined', (joinRoomArgs: JoinRoomArgs, callback: Function) => {
        handleCallback(callback, 'Opponent join received');
        setRoom(joinRoomArgs.room);
      });
    }
  }, [setRoom, socketRef]);

  const findWinner = (): "player" | "opponent" | null => {
    if (!gameOver) return null;

    if (gameOver.includes("Black wins")) {
      return orientation === "w" ? "opponent" : "player";
    } else if (gameOver.includes("White wins")) {
      return orientation === "w" ? "player" : "opponent";
    } else if (gameOver === `${opponent?.opponentUsername} has Forfeited`) {
      return "player";
    }

    return null;
  };

  const calculateRank = (win: number, loss: number) => (win * win) / (win + loss);

  const handleWinLossChange = async (winner: "player" | "opponent" | null): Promise<void> => {
    if (!player || !player.win || !player.loss || !opponent) return;

    const userCollection = collection(db, 'users');
    const playerDoc = doc(userCollection, player.userId);
    const opponentDoc = doc(userCollection, opponent.opponentUserId);

    const playerRank = calculateRank(player.win, player.loss);
    const opponentRank = calculateRank(opponent.opponentWin, opponent.opponentLoss);

    try {
      if (winner === "player") {
        await updateDoc(playerDoc, { win: increment(1), rank: playerRank });
        await updateDoc(opponentDoc, { loss: increment(1), rank: opponentRank });
      } else {
        await updateDoc(opponentDoc, { win: increment(1), rank: opponentRank });
        await updateDoc(playerDoc, { loss: increment(1), rank: playerRank });
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    handleMove();
    handleDisconnect();
    handlePlayerForfeited();
    handleOpponentJoined();
  }, [handleMove, handleDisconnect, handlePlayerForfeited, handleOpponentJoined]);

  return {
    onDrop,
    handleWinLossChange,
    findWinner,
  };
};
