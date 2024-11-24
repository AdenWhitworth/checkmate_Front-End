import React from 'react';
import './GlobalStats.css';
import pawn from "../../../../Images/Pawn Logo.svg";
import board from "../../../../Images/Chess Board Logo.svg";

/**
 * A React functional component that displays global statistics for a chess application,
 * including the total number of players and games played.
 *
 * @returns {JSX.Element} A JSX element representing the global statistics section.
 */
export default function GlobalStats(): JSX.Element {
    return (
        <div className="global">
            <div className='global-stats'>
                <div className='global-stats-row-1'>
                    <div className='global-stats-icon'>
                        <img src={pawn} alt='Pawn logo'></img>
                    </div>
                    <h1>10</h1>
                </div>

                <div className='global-stats-row-2'>
                    <h5>TOTOAL PLAYERS</h5>
                </div>
            </div>

            <hr className='custom-line'></hr>

            <div className='global-stats'>
                <div className='global-stats-row-1'>
                    <div className='global-stats-icon'>
                        <img src={board} alt='Pawn logo'></img>
                    </div>
                    <h1>10</h1>
                </div>

                <div className='global-stats-row-2'>
                    <h5>TOTOAL GAMES</h5>
                </div>
            </div>
        </div>          
    );
}