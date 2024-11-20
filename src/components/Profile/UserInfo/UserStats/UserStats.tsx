import React from 'react';
import './UserStats.css';
import plus from '../../../../Images/plus yellow.svg';
import board from '../../../../Images/board yellow.svg';
import trophy from '../../../../Images/trophy yellow.svg';
import shield from '../../../../Images/shield yellow.svg';
import flag from '../../../../Images/flag yellow.svg';
import { usePlayer } from '../../../../Providers/PlayerProvider/PlayerProvider';
import { Timestamp } from 'firebase/firestore';

/**
 * Formats a Firestore `Timestamp` into a readable date string in MM/DD/YYYY format.
 *
 * @param {Timestamp | null | undefined} timestamp - The Firestore `Timestamp` to format.
 * @returns {string} The formatted date string or an empty string if the timestamp is null or undefined.
 */
const formatDate = (timestamp: Timestamp | null | undefined): string => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

/**
 * Renders a single row in the user stats display.
 *
 * @param {Object} props - The props for the `StatRow` component.
 * @param {string} props.icon - The source URL for the icon image.
 * @param {string} props.label - The label for the stat (e.g., "Wins", "Losses").
 * @param {string | number | undefined} props.value - The value of the stat to display.
 * @returns {JSX.Element} A styled row displaying the stat icon, label, and value.
 */
const StatRow = ({ icon, label, value }: { icon: string; label: string; value: string | number | undefined }): JSX.Element => (
    <div className='stats-row'>
        <div className='stats-row-left'>
            <div className='stat-icon'>
                <img src={icon} alt={`${label} icon`} />
            </div>
            <h5>{label}</h5>
        </div>
        <h5 className='stats-row-right'>{value ?? ''}</h5>
    </div>
);

/**
 * Displays user statistics such as join date, games played, wins, draws, and losses.
 *
 * @returns {JSX.Element} The rendered `UserStats` component.
 */
export default function UserStats(): JSX.Element {
    const { playerDynamic, playerStatic } = usePlayer();

    const statsData = [
        { icon: plus, label: 'Joined', value: formatDate(playerStatic?.createdAt) },
        { icon: board, label: 'Games', value: playerDynamic?.gamesPlayed },
        { icon: trophy, label: 'Wins', value: playerDynamic?.win },
        { icon: shield, label: 'Draws', value: playerDynamic?.draw },
        { icon: flag, label: 'Losses', value: playerDynamic?.loss },
    ];

    return (
        <div className='stats'>
            {statsData.map((stat, index) => (
                <StatRow key={index} icon={stat.icon} label={stat.label} value={stat.value} />
            ))}
        </div>
    );
}

