import React from "react";
import { useGame } from "../../../Providers/GameProvider/GameProvider";
import { usePlayer } from "../../../Providers/PlayerProvider/PlayerProvider";
import { useCapturedPieces } from "../../../Hooks/useCapturedPieces/useCapturedPieces";
import './InGameStats.css';
import GameStats from "./GameStats/GameStats";
import HistoryMoves from "./HistoryMoves/HistoryMoves";

export default function InGameStats() {
    const { orientation, playerTurn, opponent, room } = useGame();
    const { player } = usePlayer();
    const { playerPieces, opponentPieces } = useCapturedPieces();

    const isWhite = orientation === "w";
    const isPlayerTurn = room && room.players.length >= 2 && playerTurn === (isWhite ? "w" : "b");

    return (
        <div className="game-card">

            <GameStats 
                username={opponent?.opponentUsername || 'Opponent'} 
                wins={opponent?.opponentWin || 0} 
                losses={opponent?.opponentLoss || 0} 
                pieces={opponentPieces} 
                isTurn={!!(room && room.players.length >= 2 && !isPlayerTurn)} 
                isLoading={room && room.players.length < 2 || false}
            ></GameStats>
    
            <HistoryMoves></HistoryMoves>

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