import React from "react";
import { usePlayer } from "../../../Providers/PlayerProvider/PlayerProvider";
import { useCapturedPieces } from "../../../Hooks/useCapturedPieces/useCapturedPieces";
import '../../Dashboard/InGameStats/InGameStats.css';
import GameStats from "../../Dashboard/InGameStats/GameStats/GameStats";
import HistoryMoves from "../../Dashboard/InGameStats/HistoryMoves/HistoryMoves";
import { useBot } from "../../../Providers/BotProvider/BotProvider";
import { BotGame } from "../../../Providers/BotProvider/BotProviderTypes";
import BotInGameHelp from "./BotInGameHelp/BotInGameHelp";

const options = {
    novice: { label: "Novice", range: "< 1000"},
    intermediate: { label: "Intermediate", range: "1000-1500"},
    advanced: { label: "Advanced", range: "1500-2000"},
    master: { label: "Master", range: "> 2000"},
};

/**
 * Renders the in-game statistics for a bot chess game. Displays stats for the bot and the player,
 * move history, and in-game help if enabled.
 *
 * @component
 * @returns {JSX.Element} - The rendered BotInGameStats component.
 */
export default function BotInGameStats(): JSX.Element {
    const { orientation, playerTurn, botGame, history, gameMoves, setGameMoves, difficulty, help } = useBot();
    const { playerStatic, playerDynamic } = usePlayer();
    const { playerPieces, opponentPieces } = useCapturedPieces({orientation, history});

    const isWhite = orientation === "w";
    const isRoomFull = checkIfRoomIsFull(botGame);
    const isPlayerTurn = checkIfPlayerTurn(isRoomFull, playerTurn, isWhite);
    const isOpponentTurn = checkIfOpponentTurn(isRoomFull, playerTurn, isWhite);

    /**
     * Checks if the room is full by ensuring both players are connected.
     *
     * @param {BotGame | null} botGame - The current bot game object.
     * @returns {boolean} - True if both players are connected, otherwise false.
     */
    function checkIfRoomIsFull(botGame: BotGame | null): boolean {
        return !!(botGame && botGame.playerA.connected && botGame.playerB.connected);
    }

    /**
     * Determines if it is the player's turn based on the room status, player turn, and orientation.
     *
     * @param {boolean} isRoomFull - Whether the room is full (both players connected).
     * @param {"w" | "b"} playerTurn - The current turn ("w" for white, "b" for black).
     * @param {boolean} isWhite - True if the player is white.
     * @returns {boolean} - True if it is the player's turn, otherwise false.
     */
    function checkIfPlayerTurn(isRoomFull: boolean, playerTurn: "w" | "b", isWhite: boolean): boolean {
        return isRoomFull && playerTurn === (isWhite ? "w" : "b");
    }

    /**
     * Determines if it is the opponent's turn based on the room status, player turn, and orientation.
     *
     * @param {boolean} isRoomFull - Whether the room is full (both players connected).
     * @param {"w" | "b"} playerTurn - The current turn ("w" for white, "b" for black).
     * @param {boolean} isWhite - True if the player is white.
     * @returns {boolean} - True if it is the opponent's turn, otherwise false.
     */
    function checkIfOpponentTurn(isRoomFull: boolean, playerTurn: "w" | "b", isWhite: boolean): boolean {
        return isRoomFull && playerTurn === (isWhite ? "b" : "w");
    }

    return (
        <div className="game-card">
            <GameStats 
                username={`Bot ${options[difficulty].label}`} 
                elo={options[difficulty].range} 
                pieces={opponentPieces} 
                isTurn={isOpponentTurn} 
                isLoading={!isRoomFull}
            />

            <HistoryMoves 
                history={history}
                gameMoves={gameMoves}
                setGameMoves={setGameMoves}
            />

            {help !== "challenge" && <BotInGameHelp />}

            <GameStats 
                username={playerStatic?.username || 'Player'} 
                elo={playerDynamic?.elo || 0}
                pieces={playerPieces} 
                isTurn={isPlayerTurn} 
                isLoading={false}
            />
        </div>
    );
}