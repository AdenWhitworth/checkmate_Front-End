import React, { useEffect } from 'react';
import Header from '../Header/Header';
import "./PuzzleDashboard.css";
import ActiveGame from '../Dashboard/ActiveGame/ActiveGame';
import { usePuzzle } from '../../Providers/PuzzleProvider/PuzzleProvider';
import PuzzleLobby from './PuzzleLobby/PuzzleLobby';
import PuzzleInGameStats from './PuzzleInGameStats/PuzzleInGameStats';
import PuzzleOverModal from '../Modal/PuzzleOverModal/PuzzleOverModal';
import ReconnectPuzzleModal from '../Modal/ReconnectPuzzleModal/ReconnectPuzzleModal';
import CreatePuzzleAlertBadge from '../AlertBadge/CreatePuzzleAlertBadge/CreatePuzzleAlertBadge';
import ReconnectPuzzleBadge from '../AlertBadge/ReconnectPuzzleBadge/ReconnectPuzzleBadge';

/**
 * PuzzleDashboard component that serves as the main container for the active game,
 * lobby, and various puzzle game-related modals and alerts.
 * 
 * @component
 * @returns {JSX.Element} - The rendered PuzzleDashboard component.
 */
export default function PuzzleDashboard(): JSX.Element {
    
    const { orientation, fen, onDrop, onPromotionPieceSelect, puzzle, handleReconnectPuzzle} = usePuzzle();

    /**
     * Attempt to reconnect to an active puzzle game if present.
     */
    useEffect(() => {
        handleReconnectPuzzle();
    },[handleReconnectPuzzle])
    
    return (
        <>  
            <Header />

            <section className="puzzle-dashboard">
                <div className="puzzle-dashboard-content">
                    <ActiveGame 
                        orientation={orientation}
                        fen={fen}
                        onDrop={onDrop}
                        onPromotionPieceSelect={onPromotionPieceSelect}
                    />

                    {puzzle? <PuzzleInGameStats /> : <PuzzleLobby />}
                </div>
            </section>

            <PuzzleOverModal />
            <ReconnectPuzzleModal />
            <CreatePuzzleAlertBadge />
            <ReconnectPuzzleBadge />
        </>
    );
}