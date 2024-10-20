/**
 * Interface representing a player's information on the leaderboard.
 * 
 * @interface LeaderBoardPlayer
 * @property {string} username - The username of the player.
 * @property {number} win - The number of wins the player has achieved.
 * @property {number} loss - The number of losses the player has.
 * @property {string} id - The unique identifier for the player.
 */
export interface LeaderBoardPlayer {
    username: string;
    win: number;
    loss: number;
    id: string;
}

/**
 * Interface representing the output of the useLeaderBoard hook.
 * 
 * @interface UseLeaderBoardOutput
 * @property {LeaderBoardPlayer[]} leaderBoardPlayers - An array of players with their leaderboard information.
 * @property {boolean} loadingLeaders - A boolean indicating if the leaderboard data is being fetched.
 * @property {string | null} leadersError - An error message if there is an issue fetching leaderboard data, or null if there is no error.
 */
export interface UseLeaderBoardOutput {
    leaderBoardPlayers: LeaderBoardPlayer[];
    loadingLeaders: boolean;
    leadersError: string | null;
}
