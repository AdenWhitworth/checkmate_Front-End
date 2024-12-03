/**
 * Represents an option for selecting bot difficulty in the bot lobby.
 *
 * @interface Option
 * @property {string} icon - The source path for the icon associated with the option.
 * @property {"Novice" | "Intermediate" | "Advanced" | "Master"} label - The display label for the option.
 * @property {"< 1000" | "1000-1500" | "1500-2000" | "> 2000"} range - The ELO range represented by the option.
 * @property {"novice" | "intermediate" | "advanced" | "master"} value - The internal value representing the difficulty level.
 */
export interface Option {
    icon: string;
    label: "Novice" | "Intermediate" | "Advanced" | "Master";
    range: "< 1000" | "1000-1500" | "1500-2000" | "> 2000";
    value: "novice" | "intermediate" | "advanced" | "master";
}