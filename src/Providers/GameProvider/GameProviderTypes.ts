import { Move, Chess } from "chess.js";

export interface SocketPlayer {
    id: string;
    username: string;
};

export interface Room {
    roomId: string;
    players: SocketPlayer[];
};

export interface Opponent {
    opponentUsername: string;
    opponentUserId: string;
    opponentPlayerId: string;
    opponentWin: number;
    opponentLoss: number;
    opponentInviteId: string;
}

export interface GameContextType {
    playerTurn: "w" | "b";
    setPlayerTurn: (value: "w" | "b") => void;
    history: Move[];
    setHistory: (value: Move[]) => void;
    opponent: Opponent | null;
    setOpponent: (value: Opponent | null) => void;
    orientation: "w" | "b";
    setOrientation: (value: "w" | "b") => void;
    room: Room | null;
    setRoom: (value: Room | null) => void;
    forfeitGame: boolean
    setForfeitGame: (value: boolean) => void;
    fen: string;
    setFen: (value: string) => void;
    gameOver: string | null;
    setGameOver: (value: string | null) => void;
    cleanup: () => void;
    chess: Chess;
}