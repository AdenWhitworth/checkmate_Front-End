import { useCallback, useEffect } from "react";
import { Move, Square } from "chess.js";
import { useSocket } from "../../Providers/SocketProvider/SocketProvider";
import { MoveArgs } from "../../Providers/SocketProvider/SocketProviderTypes";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { UseBotChessGameOutput, UseBotChessGameProps } from "./useBotChessGameTypes";

/**
 * Custom hook for managing a bot chess game using socket connections.
 *
 * @param {UseChessGameProps} props - The properties required by the useBotChessGame hook.
 * @returns {UseChessGameOutput} - The returned functions and properties from the useBotChessGame hook.
 */
export const useBotChessGame = ({ 
  game,
  setGame, 
  setHistory, 
  setPlayerTurn, 
  orientation, 
  chess, 
  setFen,
  gameOver, 
  setGameOver,
  setErrorMove,
  setGameMoves,
}: UseBotChessGameProps): UseBotChessGameOutput => {
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
   * Initializes the socket event listeners when the hook mounts.
   */
  useEffect(() => {
    handleMove();
  }, [handleMove]);

  return {
    onDrop,
  };
};