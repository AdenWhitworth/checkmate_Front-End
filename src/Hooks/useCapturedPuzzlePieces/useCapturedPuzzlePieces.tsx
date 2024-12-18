import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import {
  PieceType,
  CapturedPiece,
  PieceState,
  PieceImages,
} from "../../components/Dashboard/InGameStats/InGameStatsTypes";
import {
  UseCapturedPuzzlePiecesOutput,
  UseCapturedPuzzlePiecesProps,
} from "./useCapturedPuzzlePiecesTypes";

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
const initialPieceCount = { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 };

/**
 * Custom hook that calculates captured chess pieces based on the current FEN string for puzzles.
 * 
 * @function useCapturedPuzzlePieces
 * @param {Object} props - Hook properties.
 * @param {string} props.orientation - The player's orientation ("w" or "b").
 * @param {string} props.fen - The current FEN string of the board.
 * @returns {UseCapturedPuzzlePiecesOutput} - Captured pieces and their states.
 */
export const useCapturedPuzzlePieces = ({
  orientation,
  fen,
}: UseCapturedPuzzlePiecesProps): UseCapturedPuzzlePiecesOutput => {
  const [capturedPieces, setCapturedPieces] = useState<CapturedPiece[]>([
    { player: "w", ...initialPieceCount },
    { player: "b", ...initialPieceCount },
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
   * Counts the remaining pieces on the board by parsing the FEN.
   * 
   * @returns {Record<"w" | "b", Record<PieceType, number>>} Remaining piece counts for each player.
   */
  const countRemainingPieces = useCallback(() => {
    const pieceCount: Record<"w" | "b", Record<PieceType, number>> = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    };

    if (fen === "start") return pieceCount;

    const chess = new Chess();
    chess.load(fen);

    chess.board().forEach((row) => {
      row.forEach((square) => {
        if (square) {
          const player = square.color;
          const pieceType = square.type as PieceType;
          pieceCount[player][pieceType] += 1;
        }
      });
    });

    return pieceCount;
  }, [fen]);

  /**
   * Calculates the captured pieces by comparing remaining pieces with the initial counts.
   */
  const calculateCapturedPieces = useCallback(() => {
    const remainingPieces = countRemainingPieces();

    const newCapturedPieces: CapturedPiece[] = [
      {
        player: "w",
        p: initialPieceCount.p - remainingPieces.w.p,
        n: initialPieceCount.n - remainingPieces.w.n,
        b: initialPieceCount.b - remainingPieces.w.b,
        r: initialPieceCount.r - remainingPieces.w.r,
        q: initialPieceCount.q - remainingPieces.w.q,
        k: initialPieceCount.k - remainingPieces.w.k,
      },
      {
        player: "b",
        p: initialPieceCount.p - remainingPieces.b.p,
        n: initialPieceCount.n - remainingPieces.b.n,
        b: initialPieceCount.b - remainingPieces.b.b,
        r: initialPieceCount.r - remainingPieces.b.r,
        q: initialPieceCount.q - remainingPieces.b.q,
        k: initialPieceCount.k - remainingPieces.b.k,
      },
    ];

    setCapturedPieces(newCapturedPieces);
  }, [countRemainingPieces]);

  /**
   * Updates the display states for captured pieces.
   */
  const updatePiecesState = useCallback(() => {
    const currentPlayer = orientation === "w" ? 0 : 1;
    const opponentPlayer = currentPlayer === 0 ? 1 : 0;

    pieceTypes.forEach((pieceType) => {
      const playerCount = capturedPieces[currentPlayer][pieceType];
      const opponentCount = capturedPieces[opponentPlayer][pieceType];

      setPlayerPieces((prev) => ({
        ...prev,
        [pieceType]: {
          img: pieceImages[opponentPlayer][pieceType][playerCount - 1] || pawn_black8,
          style: playerCount > 0 ? "game-pieces-captured" : "game-pieces-captured-hidden",
        },
      }));

      setOpponentPieces((prev) => ({
        ...prev,
        [pieceType]: {
          img: pieceImages[currentPlayer][pieceType][opponentCount - 1] || pawn_black8,
          style: opponentCount > 0 ? "game-pieces-captured" : "game-pieces-captured-hidden",
        },
      }));
    });
  }, [capturedPieces, orientation]);

  /**
   * Calculate the captured pieces on any change to the board fen.
   */
  useEffect(() => {
    calculateCapturedPieces();
  }, [fen, calculateCapturedPieces]);

  /**
   * Reformat the display state whenever the captured pieces count changes.
   */
  useEffect(() => {
    updatePiecesState();
  }, [capturedPieces, updatePiecesState]);

  return {
    capturedPieces,
    playerPieces,
    opponentPieces,
    calculateCapturedPieces,
  };
};
