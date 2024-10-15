import "../App.css";
import user_circle from "../../../Images/User Circle.svg";
import arrow_point from "../../../Images/Arrow Point.svg";
import pawn_white from "../../../Images/Pawn White.svg";
import pawn_white2 from "../../../Images/Pawn White 2.svg";
import pawn_white3 from "../../../Images/Pawn White 3.svg";
import pawn_white4 from "../../../Images/Pawn White 4.svg";
import pawn_white5 from "../../../Images/Pawn White 5.svg";
import pawn_white6 from "../../../Images/Pawn White 6.svg";
import pawn_white7 from "../../../Images/Pawn White 7.svg";
import pawn_white8 from "../../../Images/Pawn White 8.svg";
import bishop_white from "../../../Images/Bishop White.svg";
import bishop_white2 from "../../../Images/Bishop White 2.svg";
import castle_white from "../../../Images/Castle White.svg";
import castle_white2 from "../../../Images/Castle White 2.svg";
import knight_white from "../../../Images/Knight White.svg";
import knight_white2 from "../../../Images/Knight White 2.svg";
import queen_white from "../../../Images/Queen White.svg";
import king_white from "../../../Images/King White.svg";
import pawn_black from "../../../Images/Pawn Black.svg";
import pawn_black2 from "../../../Images/Pawn Black 2.svg";
import pawn_black3 from "../../../Images/Pawn Black 3.svg";
import pawn_black4 from "../../../Images/Pawn Black 4.svg";
import pawn_black5 from "../../../Images/Pawn Black 5.svg";
import pawn_black6 from "../../../Images/Pawn Black 6.svg";
import pawn_black7 from "../../../Images/Pawn Black 7.svg";
import pawn_black8 from "../../../Images/Pawn Black 8.svg";
import bishop_black from "../../../Images/Bishop Black.svg";
import bishop_black2 from "../../../Images/Bishop Black 2.svg";
import castle_black from "../../../Images/Castle Black.svg";
import castle_black2 from "../../../Images/Castle Black 2.svg";
import knight_black from "../../../Images/Knight Black.svg";
import knight_black2 from "../../../Images/Knight Black 2.svg";
import queen_black from "../../../Images/Queen Black.svg";
import king_black from "../../../Images/King Black.svg";
import {useState, useEffect} from "react";
import {v4 as uuidv4} from "uuid";
import { useGame } from "../../../Providers/GameProvider/GameProvider";
import { usePlayer } from "../../../Providers/PlayerProvider/PlayerProvider";
import HistoryItem from "./HistoryItem/HistoryItem";
import { GameMoves, PieceType, CapturedPiece, PieceState, PieceImages } from "./InGameStatsTypes";

export default function InGameStats() {
    const { orientation, playerTurn, history, opponent, room } = useGame();
    const { player } = usePlayer();
    const [opponentPlayerStyle, setOpponentPlayerStyle] = useState("game-info");
    const [activePlayerStyle, setActivePlayerStyle] = useState("game-info");
    const [gameMoves, setGameMoves] = useState<GameMoves[]>([]);

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

    const updateCapturedPieces = () => {
        const currentPlayer = orientation === "w" ? 0 : 1;
        const opponentPlayer = currentPlayer === 0 ? 1 : 0;

        updatePieces(currentPlayer, setPlayerPieces);
        updatePieces(opponentPlayer, setOpponentPieces);
    };

    const updatePieces = (playerIdx: number, piecesStateSetter: React.Dispatch<React.SetStateAction<Record<PieceType, PieceState>>>) => {
        const pieceTypes: PieceType[] = ["p", "n", "b", "r", "q"];

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

    const activeTurn = () => {
        const isWhite = orientation === "w";
        const isPlayerTurn = playerTurn === (isWhite ? "w" : "b");
    
        setOpponentPlayerStyle(isPlayerTurn ? "game-info" : "game-info player-turn");
        setActivePlayerStyle(isPlayerTurn ? "game-info player-turn" : "game-info");
    };

    const formatHistory = () => {
        const historyLength = history.length;
        if (!historyLength) return;
    
        const lastMove = history[historyLength - 1].to;
        const gameMovesCopy = [...gameMoves];
        const id = uuidv4();
    
        if (historyLength % 2 === 1) {
            gameMovesCopy.push({ id, rowMoves: { whiteMove: lastMove, blackMove: "" } });
        } else {
            gameMovesCopy[gameMovesCopy.length - 1].rowMoves.blackMove = lastMove;
        }
    
        setGameMoves(gameMovesCopy);
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
        activeTurn();
    }, [playerTurn]);
    
    useEffect(() => {
        formatHistory();
        checkCaptured();
    }, [history]);

    return (
        <div className="game-card">
            <div className={opponentPlayerStyle}>
                <div className="game-stats">
                    <div className="game-row-1">
                        <img className="game-icon" src={user_circle} alt="opponent user" />
                        <h3 className="game-username">
                            {room && room.players.length < 2 
                                ? `Waiting on ${opponent?.opponentUsername || "opponent"}...` 
                                : opponent?.opponentUsername || "Unknown Opponent"}
                        </h3>
                    </div>
                    <div className="game-row-2">
                        <h3 className="game-wins">
                            {room && room.players.length < 2 
                                ? "Win: ..." 
                                : `Win: ${opponent?.opponentWin || 0}`}
                        </h3>
                        <h3 className="game-loss">
                            {room && room.players.length < 2 
                                ? "Loss: ..." 
                                : `Loss: ${opponent?.opponentLoss || 0}`}
                        </h3>
                    </div>
                    <div className="game-row-3">
                        {Object.keys(opponentPieces).map(piece => {
                            const pieceKey = piece as PieceType;
                            return (
                            <img
                                key={pieceKey}
                                className={opponentPieces[pieceKey].style}
                                src={opponentPieces[pieceKey].img}
                                alt={`opponent ${pieceKey}`}
                            />
                            );
                        })}
                    </div>
                </div>
            </div>
    
            <div className="moves-header">
                <img className="moves-icon" src={arrow_point} alt="Arrow Icon for game moves" />
                <h3 className="moves-header-text">Game Moves</h3>
            </div>
            <div className="moves-card">
                <ul className="moves-list">
                    {gameMoves.map((gameMoves, index) => (
                        <HistoryItem rowMoves={gameMoves.rowMoves} index={index}></HistoryItem>
                    ))}
                </ul>
            </div>
    
            <div className={activePlayerStyle}>
                <div className="game-stats">
                    <div className="game-row-1">
                        <img className="game-icon" src={user_circle} alt="user" />
                        <h3 className="game-username">{player?.username || "Player"}</h3>
                    </div>
                    <div className="game-row-2">
                        <h3 className="game-wins">Win: {player?.win || 0}</h3>
                        <h3 className="game-loss">Loss: {player?.loss || 0}</h3>
                    </div>
                    <div className="game-row-3">
                        {Object.keys(playerPieces).map(piece => {
                            const pieceKey = piece as PieceType;
                            return (
                            <img
                                key={pieceKey}
                                className={playerPieces[pieceKey].style}
                                src={playerPieces[pieceKey].img}
                                alt={`player ${pieceKey}`}
                            />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}