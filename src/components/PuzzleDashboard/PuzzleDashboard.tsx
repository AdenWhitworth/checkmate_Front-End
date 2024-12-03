import React from 'react';
import Header from '../Header/Header';
import "./PuzzleDashboard.css";
import puzzle_piece from "../../Images/puzzle piece yellow.svg";

/**
 * PuzzleDashboard component.
 *
 * Displays a "Coming Soon" message for the Checkmate puzzle feature. Includes a header, 
 * a placeholder image, and a brief description to inform users about the upcoming feature.
 *
 * @returns {JSX.Element} The rendered PuzzleDashboard component.
 */
export default function PuzzleDashboard(): JSX.Element {
    return (
        <>  
            <Header />

            <section className="puzzle-dashboard">
                <div className="puzzle-dashboard-content">
                    <div>
                        <img src={puzzle_piece} alt='Puzzle piece icon'></img>
                    </div>
                    <h2>Comming Soon!</h2>
                    <p>Checkmate is excited to offer practice puzzles here soon. Keep an eye out for when this feature goes live!</p>
                </div>
            </section>
        </>
    );
}