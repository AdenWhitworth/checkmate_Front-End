import { useCallback, useEffect, useState } from "react";
import { Chess, Move, Square } from "chess.js";
import { useGame } from "../../Providers/GameProvider/GameProvider";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { useSocket, handleCallback } from "../../Providers/SocketProvider/SocketProvider";
import { MoveArgs, ForfeitArgs, DisconnectArgs } from "../../Providers/SocketProvider/SocketProviderTypes";
import { db } from '../../firebase';
import { collection, doc, increment, updateDoc} from "firebase/firestore";

export const useChessGame = () => {
  const { 
    room, 
    setHistory, 
    setPlayerTurn, 
    orientation, 
    forfeitGame, 
    chess,
    fen, 
    setFen,
    gameOver, 
    setGameOver, 
    cleanup,
    opponent 
  } = useGame();
  const { player } = usePlayer();
  const { sendMove, socketRef, sendForfeit, sendCloseRoom } = useSocket();
  
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

    try {
      sendMove({ room, move });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleMove = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('move');
      socketRef.current.on('move', (moveArgs: MoveArgs, callback) => {
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
      socketRef.current.on('playerForfeited', (forfeitArgs: ForfeitArgs, callback) => {
        setGameOver(`${forfeitArgs.username} has Forfeited`);
        handleCallback(callback, "Opponent player received the forfeit");
      });
    }
  }, [setGameOver, socketRef]);

  const handleForfeit = useCallback(async () => {
    if (socketRef.current && forfeitGame && room && player) {
      try {
        const username = player.username;
        await sendForfeit({ room, username });
        cleanup();
        /********* Send Home **********/
      } catch (error) {
        console.log("Please try again.");
      }
    }
  }, [forfeitGame, room, player, sendForfeit, cleanup, socketRef]);

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
    const playerDoc = doc(userCollection, player.playerId);
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

  const handleSoccetCloseRoom = useCallback(async () => {
    const winner = findWinner();
    if (winner === "player" && room) {
      try {
        await handleWinLossChange(winner);
        await sendCloseRoom({ room });
      } catch (error) {
        console.log("Network error");
      }
    }
    cleanup();
  }, [findWinner, handleWinLossChange, sendCloseRoom, room, cleanup]);

  useEffect(() => {
    handleMove();
    handleDisconnect();
    handlePlayerForfeited();
    handleForfeit();
  }, [handleMove, handleDisconnect, handlePlayerForfeited, handleForfeit]);

  return {
    onDrop,
    handleSoccetCloseRoom,
  };
};
