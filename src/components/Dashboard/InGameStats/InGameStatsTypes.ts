/**
 * Represents the moves made by each player in a single row of the game's move history.
 * 
 * @interface RowMoves
 * @property {string} whiteMove - The move made by the white player.
 * @property {string} blackMove - The move made by the black player.
 */
export interface RowMoves {
    whiteMove: string;
    blackMove: string;
}

/**
 * Represents the collection of moves in a game, identified by a unique ID.
 * 
 * @interface GameMoves
 * @property {string} id - Unique identifier for a set of moves.
 * @property {RowMoves} rowMoves - The moves made by white and black players.
 */
export interface GameMoves {
    id: string;
    rowMoves: RowMoves;
}

/**
 * A type defining all possible chess piece types.
 * 
 * @type {"p" | "n" | "b" | "r" | "q" | "k"} PieceType
 */
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k";

/**
 * Represents the count of captured pieces for a player.
 * 
 * @interface CapturedPiece
 * @property {"w" | "b"} player - Indicates the player (white or black).
 * @property {number} p - Number of captured pawns.
 * @property {number} n - Number of captured knights.
 * @property {number} b - Number of captured bishops.
 * @property {number} r - Number of captured rooks.
 * @property {number} q - Number of captured queens.
 * @property {number} k - Number of captured kings.
 */
export interface CapturedPiece {
    player: "w" | "b";
    p: number;
    n: number;
    b: number;
    r: number;
    q: number;
    k: number;
}

/**
 * Represents the state of a chess piece on the board, including its image and style.
 * 
 * @interface PieceState
 * @property {string} img - The image source for the chess piece.
 * @property {string} style - CSS style class for the piece.
 */
export interface PieceState {
    img: string;
    style: string;
}

/**
 * Represents the images for each type of chess piece.
 * 
 * @interface PieceImages
 * @property {string[]} p - Images for pawns.
 * @property {string[]} n - Images for knights.
 * @property {string[]} b - Images for bishops.
 * @property {string[]} r - Images for rooks.
 * @property {string[]} q - Images for queens.
 * @property {string[]} k - Images for kings.
 */
export interface PieceImages {
    p: string[];
    n: string[];
    b: string[];
    r: string[];
    q: string[];
    k: string[];
}
