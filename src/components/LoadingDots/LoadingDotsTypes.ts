/**
 * Props for the LoadingDots component to define its position, color, and size.
 * 
 * @interface LoadingDotsProps
 * 
 * @property {"left" | "center" | "right"} position - Defines the alignment of the loading dots within the container.
 * @property {"grey" | "black"} color - Defines the color theme of the loading dots.
 * @property {"small" | "medium" | "large"} size - Defines the size of each dot in the loading indicator.
 */
export interface LoadingDotsProps {
    position: "left" | "center" | "right";
    color: "grey" | "black";
    size: "small" | "medium" | "large";
}