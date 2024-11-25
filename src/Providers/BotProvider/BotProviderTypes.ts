import { Chess, Move, Square } from "chess.js";
import { Game } from "../GameProvider/GameProviderTypes";
import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";

export interface BotContextType {
    difficulty: "novice" | "intermediate" | "advanced" | "master";
    setDifficulty: (difficulty: "novice" | "intermediate" | "advanced" | "master") => void;
    help: "assisted" | "friendly" | "challenge";
    setHelp: (help: "assisted" | "friendly" | "challenge") => void;
    orientation: "w" | "b";
    setOrientation: (orientation: "w" | "b") => void;
    playerTurn: "w" | "b";
    setPlayerTurn: (value: "w" | "b") => void;
    history: Move[];
    setHistory: (value: Move[]) => void;
    game: Game | null;
    setGame: (game: Game | null) => void;
    fen: string;
    setFen: (value: string) => void;
    gameOver: string | null;
    setGameOver: (value: string | null) => void;
    cleanup: () => void;
    chess: Chess;
    errorMove: string | null;
    setErrorMove: (value: string | null) => void;
    gameMoves: GameMoves[];
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
    onDrop:(sourceSquare: Square, targetSquare: Square) => boolean;
}