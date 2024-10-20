import { LeaderBoardPlayer } from "../../../../../Hooks/useLeaderBoard/useLeaderBoardTypes";

/**
 * Interface representing the properties for the LeaderBoardItem component.
 * 
 * @interface LeaderBoardItemProps
 * 
 * @property {LeaderBoardPlayer} player - An object representing a player's details, including username, wins, and losses.
 * @property {number} index - The index of the player within the leaderboard list (used to determine ranking).
 */
export interface LeaderBoardItemProps {
    player: LeaderBoardPlayer;
    index: number;
}
