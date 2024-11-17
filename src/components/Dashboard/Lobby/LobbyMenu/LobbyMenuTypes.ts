import { PlayerList, Invite } from "../../../../Providers/PlayerProvider/PlayerProviderTypes";

/**
 * LobbyMenuProps is an interface that defines the expected properties for the LobbyMenu component.
 * 
 * @interface LobbyMenuProps
 * @property {PlayerList[]} searchPlayerResults - An array of PlayerList objects that represent the results of a player search.
 * @property {Invite[]} searchInviteResults - An array of Invite objects that represent received invites for the player.
 */
export interface LobbyMenuProps {
    searchPlayerResults: PlayerList[];
    searchInviteResults: Invite[];
}