import { useCallback, useEffect } from "react";
import { Move, PieceSymbol, Square } from "chess.js";
import { useSocket } from "../../Providers/SocketProvider/SocketProvider";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { UseBotChessGameOutput, UseBotChessGameProps } from "./useBotChessGameTypes";
import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";

/**
 * Custom hook for managing a bot chess game using socket connections. 
 * Handles game logic, bot interactions, player moves, undo functionality, and game hints.
 *
 * @param {UseBotChessGameProps} props - The properties required by the `useBotChessGame` hook.
 * @param {Object} props.botGame - The bot game object containing game state and player details.
 * @param {Function} props.setBotGame - Function to update the bot game state.
 * @param {Function} props.setHistory - Function to update the move history.
 * @param {Function} props.setPlayerTurn - Function to update the current player's turn.
 * @param {"w" | "b"} props.orientation - The player's orientation, either "w" (white) or "b" (black).
 * @param {Object} props.chess - The chess.js instance used to manage game state.
 * @param {Function} props.setFen - Function to update the FEN (Forsyth-Edwards Notation) string.
 * @param {string | null} props.gameOver - Indicates the end state of the game if it's over, otherwise null.
 * @param {Function} props.setGameOver - Function to update the game-over state.
 * @param {Function} props.setErrorMove - Function to handle errors related to invalid moves.
 * @param {Function} props.setGameMoves - Function to update the structured game moves for UI purposes.
 * @param {"novice" | "intermediate" | "advanced" | "master"} props.difficulty - The difficulty level of the bot.
 * @param {number} props.remainingUndos - The number of undos left for the player.
 * @param {Function} props.setRemainingUndos - Function to update the remaining undos count.
 * @param {number} props.remainingHints - The number of hints left for the player.
 * @param {Function} props.setRemainingHints - Function to update the remaining hints count.
 * @param {Function} props.setHint - Function to set the hint for the player's next move.
 * @returns {UseBotChessGameOutput} - The returned functions and properties for managing the bot chess game.
 */
export const useBotChessGame = ({ 
  botGame,
  setBotGame, 
  setHistory,
  setPlayerTurn, 
  orientation, 
  chess, 
  setFen,
  gameOver, 
  setGameOver,
  setErrorMove,
  setGameMoves,
  difficulty,
  remainingUndos,
  setRemainingUndos,
  remainingHints,
  setRemainingHints,
  setHint,
  setHighlightedSquares,
  help
}: UseBotChessGameProps): UseBotChessGameOutput => {
  const { sendGetBotMove, sendGetMoveHint } = useSocket();

  /**
   * Makes a move on the board and updates the game state.
   *
   * @param {Move} move - The move object containing source and target squares, piece type, and other details.
   * @returns {Move | null} - The executed move or null if the move is invalid.
   */
  const makeAMove = useCallback((move: Move) => {
    try {
      const result = chess.move(move);
      setFen(chess.fen());
      setHistory(chess.history({ verbose: true }));
      setPlayerTurn(chess.turn());
      setHighlightedSquares({});

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
  }, [chess, setFen, setHistory, setPlayerTurn, setHighlightedSquares, setGameOver]);

  /**
   * Fetches and executes the bot's next move asynchronously.
   */
  const makeBotMove = useCallback(async () => {
    try {
      if (!botGame) return;

      const result = await sendGetBotMove({
        botGame,
        difficulty,
        fen: chess.fen(),
        currentTurn: chess.turn(),
        history: chess.history({ verbose: true }),
      });

      const botMove = result.botMove;

      const checkMove = makeAMove(botMove);

      if (!checkMove && !chess.isGameOver()) {
        throw new Error("Unable to make the bot move.");
      }
    } catch (error) {
      if (chess.isGameOver()) {
        console.warn("Bot move skipped as the game is over.");
      } else {
        setErrorMove("Bot move failed. Please try again.");
      }
    }
  }, [botGame, difficulty, chess, sendGetBotMove, makeAMove, setErrorMove]);

  /**
   * Handles the player's move and triggers the bot's response.
   *
   * @param {Square} sourceSquare - The starting square of the piece.
   * @param {Square} targetSquare - The target square of the piece.
   * @returns {boolean} - Returns true if the move is valid, false otherwise.
   */
  const onDrop = useCallback((sourceSquare: Square, targetSquare: Square): boolean => {
    if (chess.turn() !== orientation) return false;
    if (!botGame || !botGame.playerA.connected || !botGame.playerB.connected) return false;

    const promotionRank = targetSquare[1] === "8" || targetSquare[1] === "1";
    const isPawn = chess.get(sourceSquare)?.type === "p";

    if (isPawn && promotionRank) return false;

    const moveData: Move = {
      from: sourceSquare,
      to: targetSquare,
      color: chess.turn(),
      piece: chess.get(sourceSquare)?.type || "",
      promotion: undefined,
      flags: "",
      san: "",
      lan: "",
      before: "",
      after: ""
    };

    const move = makeAMove(moveData);
    if (!move) return false;
    setHint(null);
    makeBotMove();
    return true;
  }, [chess, orientation, botGame, makeAMove, setHint, makeBotMove]);

  /**
   * Ensures the bot makes the first move if the player is black.
   */
  useEffect(() => {
    if (orientation === "b" && chess.turn() === "w") {
      makeBotMove();
    }
  }, [orientation, chess, makeBotMove]);

  /**
   * Handles undo functionality, allowing the player to undo their last move and the bot's response.
   */
  const undoPreviousMove = useCallback(() => {
    if (remainingUndos === 0) {
      console.log("No undos remaining.");
      return;
    }

    const isPlayerTurn = chess.turn() === orientation;

    if (isPlayerTurn) {
      const playerMove = chess.undo();
      const opponentMove = playerMove ? chess.undo() : null;

      if (playerMove && opponentMove) {
        setRemainingUndos((prev) => (prev !== Infinity ? prev - 1 : prev));
        setFen(chess.fen());
        setGameMoves((prevMoves: GameMoves[]) => {
          const updatedMoves = [...prevMoves];

          if (updatedMoves.length > 0) {
            const lastMove = updatedMoves[updatedMoves.length - 1];

            if (lastMove.rowMoves.blackMove) {
              lastMove.rowMoves.blackMove = "";
            } else {
              updatedMoves.pop();
            }

            if (updatedMoves.length > 0) {
              updatedMoves[updatedMoves.length - 1].rowMoves.whiteMove = "";
            }
          }

          return updatedMoves;
        });

        setHistory(chess.history({ verbose: true }));
        setPlayerTurn(chess.turn());

        console.log("Two moves undone. Remaining undos:", remainingUndos - 1);
      } else {
        console.log("Not enough moves to undo.");
      }
    } else {
      console.log("Undo is only allowed on your turn.");
    }
  }, [chess, orientation, remainingUndos, setFen, setGameMoves, setHistory, setPlayerTurn, setRemainingUndos]);

  /**
   * Fetches a hint for the player's next move from the bot.
   */
  const requestHint = useCallback(async () => {
    if (remainingHints === 0) {
      console.log("No hints remaining.");
      return;
    }

    try {
      if (!botGame) throw new Error("Bot game is not set.");
      const {move} = await sendGetMoveHint({
        fen: chess.fen(),
        currentTurn: chess.turn(),
      });
      setHint([move.from as Square, move.to as Square]);
      setRemainingHints((prev) => (prev !== Infinity ? prev - 1 : prev));
    } catch (error) {
      console.error("Error fetching hint:", error);
    }
}, [botGame, chess, remainingHints, sendGetMoveHint, setHint, setRemainingHints]);

  /**
   * Determines the winner of the game based on the game state.
   *
   * @returns {"playerA" | "playerB" | "draw" | null} - The winner of the game or null if no winner.
   */
  const findWinner = useCallback((): "playerA" | "playerB" | "draw" | null => {
    if (!gameOver) return null;
    
    const playerAColor = botGame?.playerA.orientation;

    if (gameOver.includes("Black wins")) {
      return playerAColor === "b" ? "playerA" : "playerB";
    }

    if (gameOver.includes("White wins")) {
      return playerAColor === "w" ? "playerA" : "playerB";
    }

    if (gameOver.includes("Draw")) {
      return "draw";
    }

    return null;
  }, [botGame, gameOver]);

  /**
   * Highlights possible moves for a clicked piece.
   *
   * @param {Square} square - The clicked square.
   */
  const onSquareClick = useCallback((square: Square) => {
    if (chess.turn() !== orientation || help !== "assisted") return setHighlightedSquares({});
    if (!botGame || !botGame.playerA.connected || !botGame.playerB.connected) return setHighlightedSquares({});

    const possibleMoves = chess.moves({ square, verbose: true });

    if (possibleMoves.length > 0) {
      const squares = possibleMoves.reduce((acc, move) => {
        acc[move.to] = {
          background: chess.get(move.to)
            ? "radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)"
            : "radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)",
          borderRadius: "50%",
        };
        return acc;
      }, {} as Record<string, any>);

      squares[square] = {
        background: "rgba(255, 255, 0, 0.4)",
      };

      setHighlightedSquares(squares);
    } else {
      setHighlightedSquares({});
    }
  },[botGame, chess, help, orientation, setHighlightedSquares]);

  /**
 * Handles the selection of a promotion piece during a pawn promotion. 
 * Validates the promotion move and executes it if valid.
 *
 * @param {PromotionPieceOption} [piece] - The selected promotion piece (e.g., "wQ" for white queen, "bR" for black rook).
 * @param {Square} [promoteFromSquare] - The square from which the pawn is being promoted.
 * @param {Square} [promoteToSquare] - The square to which the pawn is being promoted.
 * @returns {boolean} - Returns `true` if the promotion move is valid and executed successfully; otherwise, returns `false`.
 */
  const onPromotionPieceSelect = useCallback((
    piece?: PromotionPieceOption,
    promoteFromSquare?: Square,
    promoteToSquare?: Square
  ): boolean => {
    if (chess.turn() !== orientation) return false;
    if (!botGame || !botGame.playerA.connected || !botGame.playerB.connected) return false;
    if (!piece || !promoteFromSquare || !promoteToSquare) return false;
  
    const promotionPieceType = piece.slice(1).toLowerCase() as PieceSymbol;
  
    const moveData: Move = {
      from: promoteFromSquare,
      to: promoteToSquare,
      color: chess.turn(),
      piece: chess.get(promoteFromSquare)?.type || "",
      promotion: promotionPieceType,
      flags: "",
      san: "",
      lan: "",
      before: "",
      after: ""
    };
  
    const move = makeAMove(moveData);
    if (!move) return false;
    setHint(null);
    makeBotMove();
    return true;
  }, [botGame, chess, makeAMove, makeBotMove, orientation, setHint]);
  
  return {
    onDrop,
    undoPreviousMove,
    requestHint,
    findWinner,
    onSquareClick,
    onPromotionPieceSelect
  };
};