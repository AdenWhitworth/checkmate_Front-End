import pawn_white from "../../Images/Pawn White.svg";
import pawn_white2 from "../../Images/Pawn White 2.svg";
import pawn_white3 from "../../Images/Pawn White 3.svg";
import pawn_white4 from "../../Images/Pawn White 4.svg";
import pawn_white5 from "../../Images/Pawn White 5.svg";
import pawn_white6 from "../../Images/Pawn White 6.svg";
import pawn_white7 from "../../Images/Pawn White 7.svg";
import pawn_white8 from "../../Images/Pawn White 8.svg";
import bishop_white from "../../Images/Bishop White.svg";
import bishop_white2 from "../../Images/Bishop White 2.svg";
import castle_white from "../../Images/Castle White.svg";
import castle_white2 from "../../Images/Castle White 2.svg";
import knight_white from "../../Images/Knight White.svg";
import knight_white2 from "../../Images/Knight White 2.svg";
import queen_white from "../../Images/Queen White.svg";
import king_white from "../../Images/King White.svg";
import pawn_black from "../../Images/Pawn Black.svg";
import pawn_black2 from "../../Images/Pawn Black 2.svg";
import pawn_black3 from "../../Images/Pawn Black 3.svg";
import pawn_black4 from "../../Images/Pawn Black 4.svg";
import pawn_black5 from "../../Images/Pawn Black 5.svg";
import pawn_black6 from "../../Images/Pawn Black 6.svg";
import pawn_black7 from "../../Images/Pawn Black 7.svg";
import pawn_black8 from "../../Images/Pawn Black 8.svg";
import bishop_black from "../../Images/Bishop Black.svg";
import bishop_black2 from "../../Images/Bishop Black 2.svg";
import castle_black from "../../Images/Castle Black.svg";
import castle_black2 from "../../Images/Castle Black 2.svg";
import knight_black from "../../Images/Knight Black.svg";
import knight_black2 from "../../Images/Knight Black 2.svg";
import queen_black from "../../Images/Queen Black.svg";
import king_black from "../../Images/King Black.svg";
import React, {useState, useEffect, useCallback} from "react";
import { PieceType, CapturedPiece, PieceState, PieceImages } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { UseCapturedPiecesOutput, UseCapturedPiecesProps } from "./useCapturedPiecesTypes";

const pieceImages: PieceImages[] = [
    {
        p: [pawn_white, pawn_white2, pawn_white3, pawn_white4, pawn_white5, pawn_white6, pawn_white7, pawn_white8],
        n: [knight_white, knight_white2],
        b: [bishop_white, bishop_white2],
        r: [castle_white, castle_white2],
        q: [queen_white],
        k: [king_white],
    },
    {
        p: [pawn_black, pawn_black2, pawn_black3, pawn_black4, pawn_black5, pawn_black6, pawn_black7, pawn_black8],
        n: [knight_black, knight_black2],
        b: [bishop_black, bishop_black2],
        r: [castle_black, castle_black2],
        q: [queen_black],
        k: [king_black],
    },
];

const pieceTypes: PieceType[] = ["p", "n", "b", "r", "q", "k"];

/**
 * Custom hook that manages and updates the state of captured chess pieces for both players.
 *
 * @function useCapturedPieces
 * @returns {UseCapturedPiecesOutput} The captured pieces, player and opponent pieces state, and functions to update pieces.
 */
export const useCapturedPieces = ({orientation, history}: UseCapturedPiecesProps): UseCapturedPiecesOutput => {
    const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([
        { player: "w", p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        { player: "b", p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    ]);

    const [playerPieces, setPlayerPieces] = useState<Record<PieceType, PieceState>>({
        p: { img: "", style: "game-pieces-captured-hidden" },
        n: { img: "", style: "game-pieces-captured-hidden" },
        b: { img: "", style: "game-pieces-captured-hidden" },
        r: { img: "", style: "game-pieces-captured-hidden" },
        q: { img: "", style: "game-pieces-captured-hidden" },
        k: { img: "", style: "game-pieces-captured-hidden" }
    });

    const [opponentPieces, setOpponentPieces] = useState<Record<PieceType, PieceState>>({
        p: { img: "", style: "game-pieces-captured-hidden" },
        n: { img: "", style: "game-pieces-captured-hidden" },
        b: { img: "", style: "game-pieces-captured-hidden" },
        r: { img: "", style: "game-pieces-captured-hidden" },
        q: { img: "", style: "game-pieces-captured-hidden" },
        k: { img: "", style: "game-pieces-captured-hidden" }
    });

    /**
     * Updates the pieces state for the specified player.
     * 
     * @param {number} playerIdx - The index of the player (0 for white, 1 for black).
     * @param {React.Dispatch<React.SetStateAction<Record<PieceType, PieceState>>>} piecesStateSetter - The state setter for updating piece styles and images.
     */
    const updatePieces = useCallback((playerIdx: number, piecesStateSetter: React.Dispatch<React.SetStateAction<Record<PieceType, PieceState>>>) => {
        pieceTypes.forEach((pieceType) => {
            const count = capturedPieces[playerIdx][pieceType];
            const img = pieceImages[playerIdx === 0 ? 1 : 0][pieceType][count - 1] || pawn_black8;
            const style = count > 0 ? "game-pieces-captured" : "game-pieces-captured-hidden";

            piecesStateSetter((prevState) => ({
                ...prevState,
                [pieceType]: { img, style },
            }));
        });
    },[capturedPieces]);

    /**
     * Updates the captured pieces state for both the player and the opponent.
     */
    const updateCapturedPieces = useCallback(() => {
        const currentPlayer = orientation === "w" ? 0 : 1;
        const opponentPlayer = currentPlayer === 0 ? 1 : 0;

        updatePieces(currentPlayer, setPlayerPieces);
        updatePieces(opponentPlayer, setOpponentPieces);
    }, [orientation, updatePieces]);

    /**
     * Updates tthe captured pieces state according to captures in the history state.
     */
    const checkCaptured = useCallback(() => {
        const newCapturedPieces: CapturedPiece[] = [
            { player: "w", p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
            { player: "b", p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        ];

        history.forEach((move) => {
            if (typeof move === "string") move = JSON.parse(move);
            if (move.captured) {
                const playerIdx = move.color === "w" ? 0 : 1;
                newCapturedPieces[playerIdx][move.captured] += 1;
            }
        });

        setCapturedPieces(newCapturedPieces);
    }, [history]);
    
    /**
     * Updates the captured pieces whenever there is a change in the captured pieces state or the player's orientation.
     */
    useEffect(() => {
        updateCapturedPieces();
    }, [capturedPieces, updateCapturedPieces]);

    /**
     * Checks for captured pieces whenever there is a change in the game's history.
     */
    useEffect(() => {
        checkCaptured();
    }, [history, checkCaptured]);

    return { updateCapturedPieces, capturedPieces, playerPieces, opponentPieces, checkCaptured };
};