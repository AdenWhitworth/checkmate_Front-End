export interface RowMoves {
    whiteMove: string;
    blackMove: string;
}

export interface GameMoves {
    id: string;
    rowMoves: RowMoves;
}

export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

export interface CapturedPiece {
    player: "w" | "b";
    p: number;
    n: number;
    b: number;
    r: number;
    q: number;
    k: number;
}

export interface PieceState {
    img: string;
    style: string;
}

export interface PieceImages {
    p: string[];
    n: string[];
    b: string[];
    r: string[];
    q: string[];
    k: string[];
}