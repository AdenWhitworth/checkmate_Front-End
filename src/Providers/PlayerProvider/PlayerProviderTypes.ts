import { Room } from "../GameProvider/GameProviderTypes";

export interface Player {
    playerId: string;
    userId: string;
    username: string;
    win?: number;
    loss?: number;
}

export interface PlayerContextType {
    player: Player | null;
    loading: boolean;
    error: string | null;
    players: Player[];
    invites: Invite[];
    invitesCount: number;
    lobbySelection: boolean;
    setLobbySelection: (value: boolean) => void;
}

export interface Invite {
    requestLoss: number;
    requestPlayerId: string;
    requestRoom: Room;
    requestUserId: string;
    requestUsername: string;
    requestWin: number;
    inviteId: string;
}