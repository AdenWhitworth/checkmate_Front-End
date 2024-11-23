import { Square } from "chess.js";

export interface ActiveGameProps {
    fen: string;
    onDrop:(sourceSquare: Square, targetSquare: Square) => boolean;
    orientation: "w" | "b";
}