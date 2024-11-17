import { PlayerList } from "../../../../../Providers/PlayerProvider/PlayerProviderTypes";

/**
 * Interface representing the properties for the PlayersItem component.
 * 
 * @interface PlayersItemProps
 * 
 * @property {PlayerList} potentialOpponent - A PlayerList object representing a potential opponent player.
 * @property {number} index - The index of the opponent in the list.
 */
export interface PlayersItemProps {
    potentialOpponent: PlayerList;
    index: number;
}