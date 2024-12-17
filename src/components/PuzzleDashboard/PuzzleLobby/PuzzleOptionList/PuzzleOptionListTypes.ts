/**
 * Represents a puzzle difficulty option.
 *
 * @interface OptionPuzzle
 * 
 * @property {string} icon - The path or URL of the icon image representing the puzzle difficulty.
 * @property {"Easy" | "Medium" | "Hard"} label - The user-friendly label for the puzzle difficulty.
 * @property {"< 1200" | "1200-2000" | "> 2000"} range - The Elo rating range associated with the puzzle difficulty.
 * @property {"easy" | "medium" | "hard"} value - The difficulty value used internally for selection logic.
 */
export interface OptionPuzzle {
    icon: string;
    label: "Easy" | "Medium" | "Hard";
    range: "< 1200" | "1200-2000" | "> 2000";
    value: "easy" | "medium" | "hard";
}