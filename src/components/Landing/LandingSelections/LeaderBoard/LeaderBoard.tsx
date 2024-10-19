import React from 'react';
import './LeaderBoard.css';
import { useLeaderBoard } from '../../../../Hooks/useLeaderBoard/useLeaderBoard'
import LeaderBoardItem from './LeaderBoardItem/LeaderBoardItem';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import ErrorLoading from '../../../ErrorLoading/ErrorLoading';

/**
 * LeaderBoard component displays a list of top players with their stats such as wins and losses.
 * It fetches the leaderboard data using the `useLeaderBoard` hook and handles loading and error states.
 * 
 * @component
 * @returns {JSX.Element} The rendered LeaderBoard component.
 */
export default function LeaderBoard(): JSX.Element {
    
    const { leaderBoardPlayers, loadingLeaders, leadersError } = useLeaderBoard();
    
    return (
        <div className="leaderboard">
            {loadingLeaders ? (
                <LoadingSpinner />
            ) : leadersError ? (
                <ErrorLoading
                    message={leadersError}
                ></ErrorLoading>
            ) : (
                <>  
                    <h1>Leader Board</h1>
                    <ul className="leader-list">
                        {leaderBoardPlayers.map((player, index) => (
                            <LeaderBoardItem key={player.id} player={player} index={index} />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
