import { Player, Invite } from "../../../../Providers/PlayerProvider/PlayerProviderTypes";

export interface LobbyMenuProps {
    searchPlayerResults: Player[];
    searchInviteResults: Invite[];
}