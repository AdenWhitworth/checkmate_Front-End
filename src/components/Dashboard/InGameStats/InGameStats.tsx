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
    const isRoomFull = checkIfRoomIsFull(room);
    const isPlayerTurn = checkIfPlayerTurn(isRoomFull, playerTurn, isWhite);
    const isOpponentTurn = checkIfOpponentTurn(isRoomFull, playerTurn, isWhite);

    /**
     * Checks if the room is full.
     * @param {object | null} room - The room object.
     * @returns {boolean} True if the room is full, otherwise false.
     */
    function checkIfRoomIsFull(room: any): boolean {
        return !!(room && room.players.length >= 2);
    }

    /**
     * Determines if it's the player's turn based on the room status and player orientation.
     * @param {boolean} isRoomFull - True if the room is full.
     * @param {"w" | "b"} playerTurn - The current player's turn.
     * @param {boolean} isWhite - True if the player's orientation is white.
     * @returns {boolean} True if it's the player's turn.
     */
    function checkIfPlayerTurn(isRoomFull: boolean, playerTurn: "w" | "b", isWhite: boolean): boolean {
        return isRoomFull && playerTurn === (isWhite ? "w" : "b");
    }

    /**
     * Determines if it's the opponent's turn based on the room status and player orientation.
     * @param {boolean} isRoomFull - True if the room is full.
     * @param {"w" | "b"} playerTurn - The current player's turn.
     * @param {boolean} isWhite - True if the player's orientation is white.
     * @returns {boolean} True if it's the opponent's turn.
     */
    function checkIfOpponentTurn(isRoomFull: boolean, playerTurn: "w" | "b", isWhite: boolean): boolean {
        return isRoomFull && playerTurn === (isWhite ? "b" : "w");
    }

    return (
        <div className="game-card">
            <GameStats 
                username={opponent?.opponentUsername || 'Opponent'} 
                wins={opponent?.opponentWin || 0} 
                losses={opponent?.opponentLoss || 0} 
                pieces={opponentPieces} 
                isTurn={isOpponentTurn} 
                isLoading={!isRoomFull}
            />

            <HistoryMoves />

            <GameStats 
                username={player?.username || 'Player'} 
                wins={player?.win || 0} 
                losses={player?.loss || 0} 
                pieces={playerPieces} 
                isTurn={isPlayerTurn} 
                isLoading={false}
            />
        </div>
    );
}