import { Player } from "../../../../../Providers/PlayerProvider/PlayerProviderTypes";

/**
 * Interface representing the properties for the PlayersItem component.
 * 
 * @interface PlayersItemProps
 * 
 * @property {Player} potentialOpponent - An object representing a potential opponent player.
 * @property {string} potentialOpponent.userId - The unique identifier of the potential opponent player.
 * @property {string} potentialOpponent.username - The username of the potential opponent player.
 * @property {number} index - The index of the opponent in the list.
 */
export interface PlayersItemProps {
    potentialOpponent: Player;
    index: number;
}