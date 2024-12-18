import React from 'react';
import "./PuzzleLobby.css";
import Button from '../../Button/Button';
import LoadingDots from '../../LoadingDots/LoadingDots';
import { usePuzzle } from '../../../Providers/PuzzleProvider/PuzzleProvider';
import PuzzleLobbyTitle from './PuzzleLobbyTitle/PuzzleLobbyTitle';
import PuzzleOptionList from './PuzzleOptionList/PuzzleOptionList';

/**
 * Renders the Puzzle Lobby UI, where players can configure and start a new puzzle game.
 * 
 * @component
 * @returns {JSX.Element} The PuzzleLobby component.
 */
export default function PuzzleLobby(): JSX.Element {
    const { handleCreatePuzzle, loadingStartPuzzle} = usePuzzle();

    /**
     * Handles the "Play" button click.
     * Triggers the creation of a new puzzle game.
     */
    const handlePlayClick = () => {
        handleCreatePuzzle();
    }
    
    return (
        <div className="puzzle-lobby">
            
            <PuzzleLobbyTitle />

            <PuzzleOptionList></PuzzleOptionList>

            <div className='puzzle-options-btn'>
                <Button 
                    onClick={handlePlayClick} 
                    styleType='primary' 
                    className='full-button' 
                    disabled={loadingStartPuzzle}
                >{loadingStartPuzzle? <LoadingDots position={'center'} color={'black'} size={'small'} />: "Play"}</Button>
            </div>
        </div>
    );
}