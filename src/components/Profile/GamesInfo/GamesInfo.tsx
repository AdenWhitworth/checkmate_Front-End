import React from 'react';
import "./GamesInfo.css";
import { useTrackGames } from '../../../Hooks/useTrackGames/useTrackGames';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import ErrorLoading from '../../ErrorLoading/ErrorLoading';
import GamesItem from './GamesItem/GamesItem';

/**
 * GameInfo component to display a list of played games.
 *
 * This component uses the `useTrackGames` hook to fetch data about the games 
 * played by the user, including loading and error states. It conditionally 
 * renders a loading spinner, an error message, or the list of games based on 
 * the current state.
 *
 * @returns {JSX.Element} The rendered GameInfo component.
 */
export default function GamesInfo(): JSX.Element {

    const { playedGames, loadingPlayedGames, playedGamesError } = useTrackGames();

    return (
        <div className="games-info">
            {loadingPlayedGames ? (
                <LoadingSpinner />
            ) : playedGamesError ? (
                <ErrorLoading
                    message={playedGamesError}
                ></ErrorLoading>
            ) : (
                <>  
                    <h2>Games</h2>
                    <div className='games-title'>
                        <div></div>
                        <h5>Players</h5>
                        <h5>Result</h5>
                        <h5>Moves</h5>
                        <h5>Date</h5>
                    </div>
                    <ul className="games-list">
                        {playedGames.map((game, index) => (
                            <GamesItem key={game.gameId} game={game} index={index} />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}