import { useCallback, useEffect } from "react";
import { Move, Square } from "chess.js";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { useSocket } from "../../Providers/SocketProvider/SocketProvider";
import { MoveArgs, ForfeitArgs, DisconnectArgs, JoinRoomArgs } from "../../Providers/SocketProvider/SocketProviderTypes";
import { db } from '../../firebase';
import { collection, doc, increment, writeBatch} from "firebase/firestore";
import { UseChessGameProps, UseChessGameOutput } from "./useChessGameTypes";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";

/**
 * Custom hook for managing a multiplayer chess game using socket connections.
 *
 * @param {UseChessGameProps} props - The properties required by the useChessGame hook.
 * @returns {UseChessGameOutput} - The returned functions and properties from the useChessGame hook.
 */
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
}: UseChessGameProps): UseChessGameOutput => {
  const { player } = usePlayer();
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
   * Handles dropping a piece on the board and sending the move to the opponent.
   *
   * @param {Square} sourceSquare - The starting square of the piece.
   * @param {Square} targetSquare - The destination square of the piece.
   * @returns {boolean} - True if the move was successful, false otherwise.
   */
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

  /**
   * Sends a move asynchronously to the server and handles rollback on failure.
   *
   * @async
   * @param {Move} move - The move to send.
   * @param {string} previousFen - The FEN notation of the board before the move.
   */
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
  }, [makeAMove, socketRef]);

  /**
   * Sets up event listeners for handling opponent disconnection.
   */
  const handleDisconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('playerDisconnected');
      socketRef.current.on('playerDisconnected', (disconnectArgs: DisconnectArgs) => {
        setGameOver(`${disconnectArgs.player.username} has Forfeited`);
      });
    }
  }, [setGameOver, socketRef]);

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
  }, [setGameOver, socketRef]);

  /**
   * Sets up event listeners for handling an opponent joining the game.
   */
  const handleOpponentJoined = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.off('opponentJoined');
      socketRef.current.on('opponentJoined', (joinRoomArgs: JoinRoomArgs, callback: Function) => {
        handleCallback(callback, 'Opponent join received');
        setRoom(joinRoomArgs.room);
      });
    }
  }, [setRoom, socketRef]);

  /**
   * Determines the winner of the game based on the game state.
   *
   * @returns {"player" | "opponent" | null} - The winner of the game or null if no winner.
   */
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

  /**
   * Calculates a player's rank based on their win/loss ratio.
   *
   * @param {number} win - The number of wins.
   * @param {number} loss - The number of losses.
   * @returns {number} - The calculated rank.
   */
  const calculateRank = (win: number, loss: number): number => (win * win) / (win + loss);

  /**
   * Handles updating the win/loss count and rank for both players based on the game outcome.
   *
   * @async
   * @param {"player" | "opponent" | null} winner - The winner of the game.
   * @returns {Promise<void>}
   */
  const handleWinLossChange = async (winner: "player" | "opponent" | null): Promise<void> => {
    if (!player || !player.win || !player.loss || !opponent) return;

    const userCollection = collection(db, 'users');
    const playerDoc = doc(userCollection, player.userId);
    const opponentDoc = doc(userCollection, opponent.opponentUserId);

    const playerRank = calculateRank(player.win, player.loss);
    const opponentRank = calculateRank(opponent.opponentWin, opponent.opponentLoss);

    const batch = writeBatch(db);

    try {
      if (winner === "player") {
        batch.update(playerDoc, { win: increment(1), rank: playerRank });
        batch.update(opponentDoc, { loss: increment(1), rank: opponentRank });
      } else if (winner === "opponent") {
        batch.update(opponentDoc, { win: increment(1), rank: opponentRank });
        batch.update(playerDoc, { loss: increment(1), rank: playerRank });
      }
      await batch.commit();
    } catch (error) {
      throw error;
    }
  };

  /**
   * Initializes the socket event listeners when the hook mounts.
   */
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
