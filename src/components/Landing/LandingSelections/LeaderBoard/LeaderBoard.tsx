import React from 'react';
import './LeaderBoard.css';
import { useLeaderBoard } from '../../../../Hooks/useLeaderBoard/useLeaderBoard'
import LeaderBoardItem from './LeaderBoardItem/LeaderBoardItem';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import ErrorLoading from '../../../ErrorLoading/ErrorLoading';

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
