import { PromotionPieceOption } from "react-chessboard/dist/chessboard/types";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { BotGame } from "../../Providers/BotProvider/BotProviderTypes";
import { Move, Chess, Square } from "chess.js";

/**
 * Interface defining the properties passed to the `useBotChessGame` hook.
 *
 * @interface UseBotChessGameProps
 * @property {BotGame | null} botGame - The current bot game object containing game state and player details.
 * @property {(value: Move[]) => void} setHistory - Function to update the move history of the game.
 * @property {(value: "w" | "b") => void} setPlayerTurn - Function to set the current player's turn ("w" for white, "b" for black).
 * @property {"w" | "b"} orientation - The orientation of the player ("w" for white, "b" for black).
 * @property {Chess} chess - The chess.js instance responsible for managing the game logic.
 * @property {(value: string) => void} setFen - Function to update the current FEN (Forsyth-Edwards Notation) string representing the game state.
 * @property {string | null} gameOver - The end status of the game, or `null` if the game is ongoing.
 * @property {(value: string | null) => void} setGameOver - Function to set the game-over status message.
 * @property {(value: string | null) => void} setErrorMove - Function to set an error message if a move fails.
 * @property {(value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void} setGameMoves - Function to update the state of game moves. Can accept a new array or a callback function that modifies the existing state.
 * @property {"novice" | "intermediate" | "advanced" | "master"} difficulty - The difficulty level of the bot opponent.
 * @property {number} remainingUndos - The number of undo moves remaining for the player.
 * @property {(value: number | ((prev: number) => number)) => void} setRemainingUndos - Function to update the remaining undo count. Can accept a new value or a callback function.
 * @property {number} remainingHints - The number of hints remaining for the player.
 * @property {(value: number | ((prev: number) => number)) => void} setRemainingHints - Function to update the remaining hints count. Can accept a new value or a callback function.
 * @property {(hint: [Square, Square] | null) => void} setHint - Function to set or clear the hint for the player's next move.
 * @property {(value: Record<string, any>) => void} setHighlightedSquares - Function to set custom square styles for highlighting possible moves or other states on the board.
 * @property {"assisted" | "friendly" | "challenge"} help - The level of assistance provided to the player during the game.
 * @property {boolean} reconnectGame - The flag for when a game is reconnected to.
 * @property {(value: string | null) => void} setErrorUndo - Function to set an error message when an undo action fails.
 * @property {(value: string | null) => void} setErrorHint - Function to set an error message when fetching a hint fails.
 */
export interface UseBotChessGameProps {
    botGame: BotGame | null;
    setHistory: (value: Move[]) => void;
    setPlayerTurn: (value: "w" | "b") => void;
    orientation: "w" | "b";
    chess: Chess;
    setFen: (value: string) => void;
    gameOver: string | null;
    setGameOver: (value: string | null) => void;
    setErrorMove: (value: string | null) => void;
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
    difficulty: "novice" | "intermediate" | "advanced" | "master";
    remainingUndos: number;
    setRemainingUndos: (value: number | ((prev: number) => number)) => void;
    remainingHints: number;
    setRemainingHints: (value: number | ((prev: number) => number)) => void;
    setHint: (hint: [Square, Square] | null) => void;
    setHighlightedSquares: (value: Record<string, any>) => void;
    help: "assisted" | "friendly" | "challenge";
    reconnectGame: boolean;
    setErrorUndo: (value: string | null) => void;
    setErrorHint: (value: string | null) => void;
}

/**
 * Interface defining the output of the `useBotChessGame` hook.
 *
 * @interface UseBotChessGameOutput
 * @property {(sourceSquare: Square, targetSquare: Square) => boolean} onDrop - Handles the drop action
 *                          when a player moves a piece on the board. Takes the source and target squares
 *                          as parameters and returns `true` if the move is valid, otherwise `false`.
 * @property {() => void} undoPreviousMove - Function to undo the last player and bot moves. Updates the game state accordingly.
 * @property {() => void} requestHint - Function to fetch a hint for the player's next move. Deducts a hint from the remaining count.
 * @property {() => "playerA" | "playerB" | "draw" | null} findWinner - Determines the winner of the game based on the game state.
 *                              Returns `"playerA"` if player A wins, `"playerB"` if player B wins, `"draw"` for a draw, or `null` if the game is ongoing.
 * @property {(piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean} onPromotionPieceSelect - 
 *                          Callback function triggered during a pawn promotion. Receives the selected promotion piece,
 *                          the square from which the pawn was promoted, and the square to which it was promoted. 
 *                          Returns `true` if the promotion is valid, `false` otherwise.
 * @property {(square: Square) => void} onSquareClick - Handles square click events. Typically used to highlight possible moves or actions for a selected piece.
 */
export interface UseBotChessGameOutput {
    onDrop: (sourceSquare: Square, targetSquare: Square) => boolean;
    undoPreviousMove: () => void;
    requestHint: () => void;
    findWinner: () => "playerA" | "playerB" | "draw" | null;
    onSquareClick: (square: Square) => void;
    onPromotionPieceSelect: (piece?: PromotionPieceOption, promoteFromSquare?: Square, promoteToSquare?: Square) => boolean;
}