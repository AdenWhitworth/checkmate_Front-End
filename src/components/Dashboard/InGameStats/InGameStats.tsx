import arrow_point from "../../../Images/Arrow Point.svg";
import {useState, useEffect} from "react";
import {v4 as uuidv4} from "uuid";
import { useGame } from "../../../Providers/GameProvider/GameProvider";
import { usePlayer } from "../../../Providers/PlayerProvider/PlayerProvider";
import HistoryItem from "./HistoryItem/HistoryItem";
import { GameMoves } from "./InGameStatsTypes";
import { useCapturedPieces } from "../../../Hooks/useCapturedPieces/useCapturedPieces";
import './InGameStats.css';
import GameStats from "./GameStats/GameStats";

export default function InGameStats() {
    const { orientation, playerTurn, history, opponent, room } = useGame();
    const { player } = usePlayer();
    const [gameMoves, setGameMoves] = useState<GameMoves[]>([]);
    const { playerPieces, opponentPieces } = useCapturedPieces();

    const isWhite = orientation === "w";
    const isPlayerTurn = room && room.players.length >= 2 && playerTurn === (isWhite ? "w" : "b");

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
    
    useEffect(() => {
        formatHistory();
    }, [history]);

    return (
        <div className="game-card">

            <GameStats 
                username={opponent?.opponentUsername || 'Opponent'} 
                wins={opponent?.opponentWin || 0} 
                losses={opponent?.opponentLoss || 0} 
                pieces={opponentPieces} 
                isTurn={!!(room && room.players.length >= 2 && !isPlayerTurn)} 
                isLoading={room && room.players.length < 2 || true}
            ></GameStats>
    
            <div className="moves-header">
                <img className="moves-icon" src={arrow_point} alt="Arrow Icon for game moves" />
                <h3 className="moves-header-text">Game Moves</h3>
            </div>
            <div className="moves-card">
                <ul className="moves-list">
                    {gameMoves.map((gameMoves, index) => (
                        <HistoryItem key={gameMoves.id} rowMoves={gameMoves.rowMoves} index={index}></HistoryItem>
                    ))}
                </ul>
            </div>

            <GameStats 
                username={player?.username || 'Player'} 
                wins={player?.win || 0} 
                losses={player?.loss || 0} 
                pieces={playerPieces} 
                isTurn={!!(room && room.players.length >= 2 && isPlayerTurn)} 
                isLoading={false}
            ></GameStats>
        </div>
    );
}