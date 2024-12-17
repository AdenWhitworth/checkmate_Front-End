import React from 'react';
import "./PuzzleLobbyTitle.css";
import puzzle from "../../../../Images/puzzle piece white.svg";

/**
 * Renders the title section for the Puzzle Lobby.
 * 
 * @component
 * @returns {JSX.Element} The PuzzleLobbyTitle component.
 */
export default function PuzzleLobbyTitle(): JSX.Element {
    return (
        <div className="puzzle-lobby-title">
            <div className="puzzle-lobby-title-img">
                <img src={puzzle} alt="Puzzle icon" />
            </div>
            <h4>Puzzles</h4>
        </div>
    );
}