import { Move, Chess } from "chess.js";
import { Invite, Player } from "../PlayerProvider/PlayerProviderTypes";

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
    opponentInviteId?: string;
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
    fen: string;
    setFen: (value: string) => void;
    gameOver: string | null;
    setGameOver: (value: string | null) => void;
    cleanup: () => void;
    chess: Chess;
    forfeitGame: boolean;
    setForfeitGame: (value: boolean) => void;
    loadingForfeit: boolean;
    errorForfeit: string | null;
    handleForfeit: () => void;
    exitGame: boolean
    setExitGame: (value: boolean) => void;
    loadingExit: boolean;
    errorExit: string | null;
    handleExit: () => void;
    loadingCreateGameOpponentUserId: string | null;
    errorCreateGame: string | null;
    successCreateGame: string | null;
    handleCreateRoom: (value: Player) => void;
    loadingJoinGameOpponentUserId: string | null;
    errorJoinGame: string | null;
    successJoinGame: string | null;
    handleJoinRoom: (value: Invite) => void;
}