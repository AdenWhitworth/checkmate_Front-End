import React from 'react';
import "./Profile.css";
import Header from '../Header/Header';
import UserInfo from './UserInfo/UserInfo';
import GameInfo from './GameInfo/GameInfo';

/**
 * Profile component that serves as the main container for all the user information.
 * 
 * @component
 * @returns {JSX.Element} - The rendered Profile component.
 */
export default function Profile(): JSX.Element {

    return (
        <>  
            <Header />

            <section className="profile">
                <div className="profile-content">
                    <UserInfo />
                    <GameInfo />
                </div>
            </section>
        </>
    );
}