import React, { useState } from 'react';
import "./GamesInfo.css";
import { useTrackGames } from '../../../Hooks/useTrackGames/useTrackGames';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import ErrorLoading from '../../ErrorLoading/ErrorLoading';
import GamesItem from './GamesItem/GamesItem';
import ToggleSwitch from '../../ToggleSwitch/ToggleSwitch';
import bot_inactive from "../../../Images/bot yellow.svg";
import bot_active from "../../../Images/bot grey.svg"; 
import hand_inactive from "../../../Images/handshake yellow.svg";
import hand_active from "../../../Images/handshake grey.svg";

/**
 * GameInfo component to display a list of played games.
 *
 * This component uses the `useTrackGames` hook to fetch data about the games 
 * played by the user, including loading and error states. It conditionally 
 * renders a loading spinner, an error message, or the list of games based on 
 * the current state. This component offers a toggle between the online games
 * and the bot games played by the player.
 *
 * @returns {JSX.Element} The rendered GameInfo component.
 */
export default function GamesInfo(): JSX.Element {

    const { playedGames, playedBotGames, playedGamesloading, playedGamesError } = useTrackGames();

    const [isToggle, setIsToggle] = useState<boolean>(true);

    return (
        <div className="games-info">
            {playedGamesloading ? (
                <LoadingSpinner />
            ) : playedGamesError ? (
                <ErrorLoading
                    message={playedGamesError}
                ></ErrorLoading>
            ) : (
                <>  
                    <ToggleSwitch 
                        leftImgSrcActive={hand_active} 
                        leftImgSrcInActive={hand_inactive} 
                        rightImgSrcActive={bot_active} 
                        rightImgSrcInActive={bot_inactive} 
                        isToggle={isToggle} 
                        setIsToggle={setIsToggle} 
                    />
                    <h2>Games</h2>
                    <div className='games-title'>
                        <div></div>
                        <h5>Players</h5>
                        <h5>Result</h5>
                        <h5>Moves</h5>
                        <h5>Date</h5>
                    </div>
                    <ul className="games-list">
                        {isToggle? (
                            playedGames.map((game, index) => (
                                <GamesItem key={game.gameId} game={game} index={index} />
                            ))
                        ):(
                            playedBotGames.map((game, index) => (
                                <GamesItem key={game.gameId} game={game} index={index} />
                            ))
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}