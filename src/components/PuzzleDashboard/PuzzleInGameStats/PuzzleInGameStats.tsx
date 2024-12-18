import React from "react";
import { usePlayer } from "../../../Providers/PlayerProvider/PlayerProvider";
import '../../Dashboard/InGameStats/InGameStats.css';
import GameStats from "../../Dashboard/InGameStats/GameStats/GameStats";
import { usePuzzle } from "../../../Providers/PuzzleProvider/PuzzleProvider";
import { useCapturedPuzzlePieces } from "../../../Hooks/useCapturedPuzzlePieces/useCapturedPuzzlePieces";
import PuzzleGameInfo from "./PuzzleGameInfo/PuzzleGameInfo";

const options = {
    easy: { label: "Easy", range: "< 1200"},
    medium: { label: "Medium", range: "1200-2000"},
    hard: { label: "Hard", range: "> 2000"},
};

/**
 * PuzzleInGameStats Component
 *
 * This component displays in-game statistics for a puzzle game, including:
 * - Player and opponent captured pieces.
 * - Player and opponent game statistics (e.g., ELO, username, and turn information).
 * - Puzzle-specific information via the `PuzzleGameInfo` component.
 *
 * It uses data from `PlayerProvider` and `PuzzleProvider` to dynamically display
 * the appropriate stats and board orientation.
 *
 * @component
 * @returns {JSX.Element} The rendered PuzzleInGameStats component.
 */
export default function PuzzleInGameStats(): JSX.Element {
    const { orientation, playerTurn, difficulty, fen} = usePuzzle();
    const { playerStatic, playerDynamic } = usePlayer();
    const {playerPieces, opponentPieces} = useCapturedPuzzlePieces({orientation, fen})

    const isWhite = orientation === "w";
    const isPlayerTurn = checkIfPlayerTurn(playerTurn, isWhite);
    const isOpponentTurn = checkIfOpponentTurn(playerTurn, isWhite);

    /**
     * Checks if it is currently the player's turn.
     *
     * @param {("w" | "b")} playerTurn - The current player's turn ("w" for white or "b" for black).
     * @param {boolean} isWhite - A boolean indicating if the player is playing as white.
     * @returns {boolean} True if it is the player's turn; otherwise, false.
     */
    function checkIfPlayerTurn(playerTurn: "w" | "b", isWhite: boolean): boolean {
        return playerTurn === (isWhite ? "w" : "b");
    }

    /**
     * Checks if it is currently the opponent's turn.
     *
     * @param {("w" | "b")} playerTurn - The current player's turn ("w" for white or "b" for black).
     * @param {boolean} isWhite - A boolean indicating if the player is playing as white.
     * @returns {boolean} True if it is the opponent's turn; otherwise, false.
     */
    function checkIfOpponentTurn(playerTurn: "w" | "b", isWhite: boolean): boolean {
        return playerTurn === (isWhite ? "b" : "w");
    }

    return (
        <div className="game-card">
            <GameStats 
                username={`Puzzle ${options[difficulty].label}`} 
                elo={options[difficulty].range} 
                pieces={opponentPieces} 
                isTurn={isOpponentTurn} 
                isLoading={false}
                isBot={true}
            />

            <PuzzleGameInfo />
            
            <GameStats 
                username={playerStatic?.username || 'Player'} 
                elo={playerDynamic?.elo || 0}
                pieces={playerPieces} 
                isTurn={isPlayerTurn} 
                isLoading={false}
                isBot={false}
            />
        </div>
    );
}