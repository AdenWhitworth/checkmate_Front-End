import React from 'react';
import { GameStatsProps } from './GameStatsTypes';
import user_circle from "../../../../Images/User Circle.svg";
import { PieceType } from '../InGameStatsTypes';
import LoadingDots from '../../../LoadingDots/LoadingDots';
import './GameStats.css';

export default function GameStats({ 
    username, 
    wins, 
    losses, 
    pieces, 
    isTurn,
    isLoading
}: GameStatsProps) {
  return (
    <div className={`game-info ${isTurn ? 'player-turn' : ''}`}>
      <div className="game-stats">
            <div className="game-row-1">
                <img className="game-icon" src={user_circle} alt={`${username} icon`} />
                <h3 className="game-username">{username}</h3>
            </div>

            <div className="game-row-2">
                <h3 className="game-wins">Win: {wins}</h3>
                <h3 className="game-loss">Loss: {losses}</h3>
            </div>

            <div className="game-row-3">
                {isLoading? (
                    <LoadingDots></LoadingDots>
                ) : (
                    Object.keys(pieces).map((piece) => {
                        const pieceKey = piece as PieceType;
                        return (
                            <img
                                key={pieceKey}
                                className={pieces[pieceKey].style}
                                src={pieces[pieceKey].img}
                                alt={`${username} ${pieceKey}`}
                            />
                        );
                    })
                )}
            </div>
      </div>
    </div>
  );
};
