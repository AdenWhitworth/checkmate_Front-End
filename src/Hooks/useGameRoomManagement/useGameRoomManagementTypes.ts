import { Opponent, Room } from '../../Providers/GameProvider/GameProviderTypes';
import { Invite, Player } from '../../Providers/PlayerProvider/PlayerProviderTypes';

export interface UseGameRoomManagementProps {
    cleanup: () => void;
    opponent: Opponent | null;
    room: Room | null;
    setRoom: (room: Room | null) => void;
    setOrientation: (orientation: "w" | "b") => void;
    setOpponent: (opponent: Opponent | null) => void;
    setLoadingOver: (value: boolean) => void;
    setErrorOver: (value: string | null) => void;
    setExitGame: (value: boolean) => void;
    setLoadingExit: (value: boolean) => void;
    setErrorExit: (value: string | null) => void;
    setLoadingForfeit: (value: boolean) => void;
    setErrorForfeit: (value: string | null) => void;
    setForfeitGame: (value: boolean) => void;
    setLoadingCreateGameOpponentUserId: (value: string | null) => void;
    setSuccessCreateGame: (value: string | null) => void;
    setErrorCreateGame: (value: string | null) => void;
    setLoadingJoinGameOpponentUserId: (value: string | null) => void;
    setErrorJoinGame: (value: string | null) => void;
    setSuccessJoinGame: (value: string | null) => void;
    findWinner: () => "player" | "opponent" | null;
    handleWinLossChange: (winner: "player" | "opponent" | null) => Promise<void>;
}

export interface UseGameRoomManagementOutput {
    handleForfeit: () => void;
    handleExitRoom: () => void;
    handleCreateRoom: (potentialOpponent: Player) => void;
    handleJoinRoom: (invite: Invite) => void;
    handleCloseRoom: () => void;
}