import React from 'react';
import { GameStatsProps } from './GameStatsTypes';
import user_circle from "../../../../Images/User Circle.svg";
import bot from "../../../../Images/bot white.svg";
import { PieceType } from '../InGameStatsTypes';
import LoadingDots from '../../../LoadingDots/LoadingDots';
import GamePiece from './GamePiece/GamePiece';
import './GameStats.css';

/**
 * Component that displays the game statistics of a player in the active game.
 * It shows the username, win/loss record, current captured pieces, and a loading indicator for asynchronous actions.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.username - The username of the player.
 * @param {number} props.elo - The Elo rank of the player.
 * @param {Record<PieceType, PieceState>} props.pieces - An object containing the player's captured pieces and their corresponding states.
 * @param {boolean} props.isTurn - Whether it's currently the player's turn.
 * @param {boolean} props.isLoading - Indicates whether the captured pieces data is still loading.
 * @param {boolean} props.isBot - A boolean indicating whether the player whose stats are being displayed is a bot.
 * 
 * @returns {JSX.Element} The rendered GameStats component.
 */
export default function GameStats({ 
    username, 
    elo,
    pieces, 
    isTurn,
    isLoading,
    isBot,
}: GameStatsProps): JSX.Element {
    return (
        <div className={`game-info ${isTurn ? 'player-turn' : ''}`}>
            <div className="game-stats">
                <div className="game-row-1">
                    <img className="game-icon" src={isBot? bot : user_circle} alt={`${username} icon`} />
                    <h3 className="game-username">{`${username} (${elo})`}</h3>
                </div>

                <div className="game-row-2">
                    {isLoading? (
                        <LoadingDots position={'left'} color={'grey'} size={'medium'}></LoadingDots>
                    ) : (
                        Object.keys(pieces).map((key) => {
                            const pieceKey = key as PieceType;
                            const piece = pieces[pieceKey];
                            return <GamePiece key={pieceKey} piece={piece} username={username} />;
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
