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
import React, {useState, useEffect} from "react";
import { PieceType, CapturedPiece, PieceState, PieceImages } from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import { useGame } from "../../Providers/GameProvider/GameProvider";

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

export const useCapturedPieces = () => {
    const { orientation, history } = useGame();

    const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([
        { player: "w", p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        { player: "b", p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    ]);

    const [playerPieces, setPlayerPieces] = useState<Record<PieceType, PieceState>>({
        p: { img: "", style: "" },
        n: { img: "", style: "" },
        b: { img: "", style: "" },
        r: { img: "", style: "" },
        q: { img: "", style: "" },
        k: { img: "", style: "" }
    });

    const [opponentPieces, setOpponentPieces] = useState<Record<PieceType, PieceState>>({
        p: { img: "", style: "" },
        n: { img: "", style: "" },
        b: { img: "", style: "" },
        r: { img: "", style: "" },
        q: { img: "", style: "" },
        k: { img: "", style: "" }
    });

    const updateCapturedPieces = () => {
        const currentPlayer = orientation === "w" ? 0 : 1;
        const opponentPlayer = currentPlayer === 0 ? 1 : 0;

        updatePieces(currentPlayer, setPlayerPieces);
        updatePieces(opponentPlayer, setOpponentPieces);
    };

    const updatePieces = (playerIdx: number, piecesStateSetter: React.Dispatch<React.SetStateAction<Record<PieceType, PieceState>>>) => {
        const pieceTypes: PieceType[] = ["p", "n", "b", "r", "q", "k"];

        pieceTypes.forEach((pieceType) => {
            const count = capturedPieces[playerIdx][pieceType];
            const img = pieceImages[playerIdx][pieceType][count] || "";
            const style = count > 0 ? "game-pieces-captured" : "game-pieces-captured-hidden";

            piecesStateSetter((prevState) => ({
            ...prevState,
            [pieceType]: { img, style },
            }));
        });
    };

    const checkCaptured = () => {
        if (!history.length) return;
    
        const { captured: capturedPiece, color } = history[history.length - 1];
    
        if (capturedPiece) {
            setCapturedPieces(prevCaptured => 
                prevCaptured.map((pieces, idx) => {
                    if (idx === (color === "w" ? 0 : 1)) {
                        return { ...pieces, [capturedPiece]: pieces[capturedPiece] + 1 };
                    }
                    return pieces;
                })
            );
        }
    };

    useEffect(() => {
        updateCapturedPieces();
    }, [capturedPieces]);

    useEffect(() => {
        checkCaptured();
    }, [history]);

    return { updateCapturedPieces, capturedPieces, playerPieces, opponentPieces, checkCaptured };
};