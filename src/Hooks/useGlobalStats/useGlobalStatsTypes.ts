/**
 * Represents the output of the `useGlobalStats` custom hook.
 *
 * @interface UseGlobalStatsOutput
 * @property {number | null} globalGamesCount - The total count of global games. `null` if not yet fetched or an error occurred.
 * @property {boolean} loadingGlobalGamesCount - Indicates whether the global games count is currently being fetched.
 * @property {string | null} globalGamesCountError - An error message if there was an issue fetching the global games count. `null` if no error.
 * @property {number | null} globalPlayersCount - The total count of global players. `null` if not yet fetched or an error occurred.
 * @property {boolean} loadingGlobalPlayersCount - Indicates whether the global players count is currently being fetched.
 * @property {string | null} globalPlayersCountError - An error message if there was an issue fetching the global players count. `null` if no error.
 */
export interface UseGlobalStatsOutput {
    globalGamesCount: number | null;
    loadingGlobalGamesCount: boolean;
    globalGamesCountError: string | null;
    globalPlayersCount: number | null;
    loadingGlobalPlayersCount: boolean;
    globalPlayersCountError: string | null;
}
