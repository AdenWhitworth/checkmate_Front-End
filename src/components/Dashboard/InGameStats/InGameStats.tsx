import React from "react";
import { useGame } from "../../../Providers/GameProvider/GameProvider";
import { usePlayer } from "../../../Providers/PlayerProvider/PlayerProvider";
import { useCapturedPieces } from "../../../Hooks/useCapturedPieces/useCapturedPieces";
import './InGameStats.css';
import GameStats from "./GameStats/GameStats";
import HistoryMoves from "./HistoryMoves/HistoryMoves";

/**
 * InGameStats component displays the current state of the game, including statistics for the player and opponent,
 * and the history of moves made during the game.
 * It retrieves information such as the current player, opponent, and captured pieces to present the game's progress.
 *
 * @component
 * @returns {JSX.Element} The rendered InGameStats component.
 */
export default function InGameStats(): JSX.Element {
    const { orientation, playerTurn, opponent, room } = useGame();
    const { player } = usePlayer();
    const { playerPieces, opponentPieces } = useCapturedPieces();

    const isWhite = orientation === "w";
    const isRoomFull = room && room.players.length >= 2 || false;
    const isPlayerTurn = isRoomFull && playerTurn === (isWhite ? "w" : "b");

    return (
        <div className="game-card">
            <GameStats 
                username={opponent?.opponentUsername || 'Opponent'} 
                wins={opponent?.opponentWin || 0} 
                losses={opponent?.opponentLoss || 0} 
                pieces={opponentPieces} 
                isTurn={!isPlayerTurn} 
                isLoading={!isRoomFull}
            ></GameStats>
    
            <HistoryMoves />

            <GameStats 
                username={player?.username || 'Player'} 
                wins={player?.win || 0} 
                losses={player?.loss || 0} 
                pieces={playerPieces} 
                isTurn={isPlayerTurn} 
                isLoading={false}
            ></GameStats>
        </div>
    );
}