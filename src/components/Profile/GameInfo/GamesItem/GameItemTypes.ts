import { Game } from "../../../../Providers/GameProvider/GameProviderTypes";

/**
 * Props for the GamesItem component.
 *
 * @interface GamesItemProps
 * @property {Game} game - The game object containing details about a specific chess game.
 * @property {number} index - The index of the game in the list.
 */
export interface GamesItemProps {
    game: Game;
    index: number;
}

/**
 * Represents the state of a game result with an associated image and text.
 *
 * @interface GameState
 * @property {string} srcImg - The source URL of the image representing the game state.
 * @property {string} text - A descriptive text for the game state.
 */
export interface GameState {
    srcImg: string;
    text: string;
}

/**
 * Represents the possible states of a game result (win, draw, loss).
 *
 * @interface GameStates
 * @property {GameState} win - The game state when the player wins.
 * @property {GameState} draw - The game state when the game ends in a draw.
 * @property {GameState} loss - The game state when the player loses.
 */
export interface GameStates {
    win: GameState;
    draw: GameState;
    loss: GameState;
}
