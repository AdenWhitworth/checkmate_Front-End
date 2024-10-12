import React from 'react';
import './LandingSelections.css';
import Welcome from './Welcome/Welcome';
import LeaderBoard from './LeaderBoard/LeaderBoard';

export default function LandingSelections(): JSX.Element {
    
    return (
        <section className="content">
            <div className="container">
                <Welcome></Welcome>
                <LeaderBoard
                ></LeaderBoard>
            </div>
        </section>
    );
}