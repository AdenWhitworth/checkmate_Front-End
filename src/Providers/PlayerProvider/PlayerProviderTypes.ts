export interface Player {
    playerId: string;
    userId: string;
    username: string;
    win: number;
    loss: number;
}

export interface PlayerContextType {
    player: Player | null;
    loadingPlayer: boolean;
    error: string | null;
}