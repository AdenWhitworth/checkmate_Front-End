import { Game } from "../../Providers/GameProvider/GameProviderTypes";

/**
 * Represents the output of the `useTrackGames` hook.
 *
 * @interface UseTrackGamesOutput
 * @property {Game[]} playedGames - An array of games played by the current user, each containing details such as players, game status, and history.
 * @property {Game[]} playedBotGames - An array of bot games played by the current user, each containing details such as players, game status, and history.
 * @property {boolean} playedGamesloading - A boolean indicating whether the games are currently being loaded.
 * @property {string | null} playedGamesError - A string containing an error message if the games could not be fetched, or null if no error occurred.
 */
export interface UseTrackGamesOutput {
    playedGames: Game[];
    playedBotGames: Game[];
    playedGamesloading: boolean;
    playedGamesError: string | null;
}
