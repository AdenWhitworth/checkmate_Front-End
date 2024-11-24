import React from 'react';
import './LandingSelections.css';
import Welcome from './Welcome/Welcome';
import LeaderBoard from './LeaderBoard/LeaderBoard';
import GlobalStats from './GlobalStats/GlobalStats';

/**
 * LandingSelections component that displays the global stats, welcome selections and leaderboard section on the landing page.
 * 
 * @component
 * @returns {JSX.Element} The rendered LandingSelections component, containing the Welcome and LeaderBoard components.
 */
export default function LandingSelections(): JSX.Element {
    
    return (
        <section className="content">
            <div className="container">
                <GlobalStats></GlobalStats>
                <Welcome></Welcome>
                <LeaderBoard></LeaderBoard>
            </div>
        </section>
    );
}