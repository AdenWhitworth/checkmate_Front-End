export interface Player {
    playerId: string;
    userId: string;
    username: string;
    win?: number;
    loss?: number;
}

export interface PlayerContextType {
    player: Player | null;
    loadingPlayer: boolean;
    errorPlayer: string | null;
    players: Player[];
    loadingPlayers: boolean; 
    errorPlayers: string | null;
    invites: Invite[];
    invitesCount: number;
    loadingInvites: boolean;
    errorInvites: string | null;
    lobbySelection: boolean;
    setLobbySelection: (value: boolean) => void;
}

export interface Invite {
    requestLoss: number;
    requestPlayerId: string;
    requestRoomId: string;
    requestUserId: string;
    requestUsername: string;
    requestWin: number;
    inviteId: string;
}