import { GameMoves } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { Room, Opponent } from "../../Providers/GameProvider/GameProviderTypes";
import { Move, Chess } from "chess.js";

export interface UseChessGameProps {
    room: Room | null, 
    setRoom: (value: Room) => void;
    setHistory: (value: Move[]) => void; 
    setPlayerTurn: (value: "w" | "b") => void; 
    orientation: "w" | "b";
    chess: Chess;
    setFen: (value: string) => void;
    gameOver: string | null; 
    setGameOver: (value: string | null) => void;
    opponent: Opponent | null;
    setErrorMove: (value: string | null) => void;
    setGameMoves: (value: GameMoves[] | ((prev: GameMoves[]) => GameMoves[])) => void;
}