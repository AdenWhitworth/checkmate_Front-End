import { useCallback, useEffect } from "react";
import { Move, Square } from "chess.js";
import { useSocket } from "../../Providers/SocketProvider/SocketProvider";
import { MoveArgs, ForfeitArgs, DisconnectArgs, OpponentJoinedArgs, RoomReconnectedArgs } from "../../Providers/SocketProvider/SocketProviderTypes";
import { UseChessGameProps, UseChessGameOutput } from "./useChessGameTypes";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";

/**
 * Custom hook for managing a multiplayer chess game using socket connections.
 *
 * @param {UseChessGameProps} props - The properties required by the useChessGame hook.
 * @returns {UseChessGameOutput} - The returned functions and properties from the useChessGame hook.
 */
export const useChessGame = ({ 
  game,
  setGame, 
  setHistory, 
  setPlayerTurn, 
  orientation, 
  chess, 
  setFen,
  gameOver, 
  setGameOver,
  opponent,
  setErrorMove,
  setGameMoves,
  setIsOpponentDisconnected,
}: UseChessGameProps): UseChessGameOutput => {
  const { sendMove, socketRef, handleCallback } = useSocket();
  
  /**
   * Attempts to execute a chess move on the board.
   *
   * @param {Move} move - The move data containing source and target squares, piece type, etc.
   * @returns {Move|null} - The executed move or null if the move was invalid.
   */
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

  /**
   * Sends a move asynchronously to the server and handles rollback on failure.
   *
   * @async
   * @param {Move} move - The move to send.
   * @param {string} previousFen - The FEN notation of the board before the move.
   */
  const sendMoveAsync = useCallback(async (move: Move, previousFen: string) => {
    try {
      if (!game) throw Error("Room required.");
      await sendMove({ game, move, history: chess.history({verbose: true}), fen: chess.fen(), currentTurn: chess.turn()});
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
  }, [game, chess, setFen, setGameMoves, setHistory, setPlayerTurn, setErrorMove, sendMove]);

  /**
   * Handles dropping a piece on the board and sending the move to the opponent.
   *
   * @param {Square} sourceSquare - The starting square of the piece.
   * @param {Square} targetSquare - The destination square of the piece.
   * @returns {boolean} - True if the move was successful, false otherwise.
   */
  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square): boolean => {
    if (chess.turn() !== orientation) return false;
    if (!game || !game.playerA.connected || !game.playerB.connected) return false;
  
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
  }, [chess, orientation, game, makeAMove, sendMoveAsync]);
  
  /**
   * Sets up event listeners for receiving moves from the server.
   */
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
  }, [makeAMove, socketRef, handleCallback]);

  /**
   * Sets up event listeners for handling opponent disconnection.
   */
  const handleDisconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('playerDisconnected');
      socketRef.current.on('playerDisconnected', (disconnectArgs: DisconnectArgs) => {
        const isPlayerA = disconnectArgs.game.playerA.userId === disconnectArgs.disconnectUserId;
        setIsOpponentDisconnected(`${isPlayerA? disconnectArgs.game.playerA.username : disconnectArgs.game.playerB.username} has disconnected!`);
      });
    }
  }, [socketRef, setIsOpponentDisconnected]);

  /**
   * Sets up event listeners for handling opponent reconnection.
   */
  const handleRoomReconnected = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('roomReconnected');
      socketRef.current.on('roomReconnected', (roomReconnectedArgs: RoomReconnectedArgs, callback: Function) => {
        const isPlayerA = roomReconnectedArgs.game.playerA.userId === roomReconnectedArgs.connectUserId;
        setIsOpponentDisconnected(`${isPlayerA? roomReconnectedArgs.game.playerA.username : roomReconnectedArgs.game.playerB.username} has reconnected to the game!`);
        handleCallback(callback, "Opponent connected again recieved.");
      });
    }
  }, [socketRef, handleCallback, setIsOpponentDisconnected]);

  /**
   * Sets up event listeners for handling opponent forfeits.
   */
  const handlePlayerForfeited = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('playerForfeited');
      socketRef.current.on('playerForfeited', (forfeitArgs: ForfeitArgs, callback: Function) => {
        setGameOver(`${forfeitArgs.username} has Forfeited`);
        handleCallback(callback, "Opponent player received the forfeit");
      });
    }
  }, [setGameOver, socketRef, handleCallback]);

  /**
   * Sets up event listeners for handling an opponent joining the game.
   */
  const handleOpponentJoined = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('opponentJoined');
      socketRef.current.on('opponentJoined', (opponentJoinedArgs: OpponentJoinedArgs, callback: Function) => {
        handleCallback(callback, 'Opponent join received');
        setGame(opponentJoinedArgs.game);
      });
    }
  }, [setGame, socketRef, handleCallback]);

  /**
   * Determines the winner of the game based on the game state.
   *
   * @returns {"playerA" | "playerB" | "draw" | null} - The winner of the game or null if no winner.
   */
  const findWinner = useCallback((): "playerA" | "playerB" | "draw" | null => {
    if (!gameOver) return null;
    
    const playerAColor = game?.playerA.orientation;
    const isPlayerA = orientation === playerAColor;

    if (gameOver.includes("Black wins")) {
      return playerAColor === "b" ? "playerA" : "playerB";
    }

    if (gameOver.includes("White wins")) {
      return playerAColor === "w" ? "playerA" : "playerB";
    }

    if (gameOver === `${opponent?.opponentUsername} has Forfeited`) {
      return isPlayerA ? "playerA" : "playerB";
    }

    if (gameOver.includes("Draw")) {
      return "draw";
    }

    return null;
  }, [game, gameOver, orientation, opponent]);

  /**
   * Initializes the socket event listeners when the hook mounts.
   */
  useEffect(() => {
    handleMove();
    handleDisconnect();
    handlePlayerForfeited();
    handleOpponentJoined();
    handleRoomReconnected();
  }, [handleMove, handleDisconnect, handlePlayerForfeited, handleOpponentJoined, handleRoomReconnected]);

  return {
    onDrop,
    findWinner,
  };
};