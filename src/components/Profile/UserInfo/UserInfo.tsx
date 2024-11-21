import React from 'react';
import "./UserInfo.css";
import UserDetailsForm from './UserDetailsForm/UserDetailsForm';
import UserStats from './UserStats/UserStats';

/**
 * UserInfo component that combines the user's details form and statistics display.
 * 
 * @returns {JSX.Element} The rendered UserInfo component.
 */
export default function UserInfo(): JSX.Element {
    return (
        <div className='user-info'>
            <UserDetailsForm />
            
            <hr className="line"></hr>

            <UserStats />
        </div>
    );
}
