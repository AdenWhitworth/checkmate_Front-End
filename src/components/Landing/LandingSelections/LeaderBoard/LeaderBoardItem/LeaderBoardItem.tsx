import React from 'react';
import gold_medal from "../../../../../Images/Gold Medal.svg";
import silver_medal from "../../../../../Images/Silver Medal.svg";
import bronze_medal from "../../../../../Images/Bronze Medal.svg";
import { LeaderBoardItemProps } from "./LeaderBoardItemTypes";
import './LeaderBoardItem.css';

/**
 * LeaderBoardItem component that displays information about a player in the leaderboard, including rank, username, wins, and losses.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.player - The player object containing details about the player.
 * @param {string} props.player.username - The username of the player.
 * @param {number} props.player.elo - The elo of the player
 * @param {number} props.index - The index of the player in the leaderboard list (used to determine rank).
 * 
 * @returns {JSX.Element} The rendered LeaderBoardItem component.
 */
export default function LeaderBoardItem({
    player, 
    index
}: LeaderBoardItemProps): JSX.Element {

    const place = index + 1;

    const medals = [gold_medal, silver_medal, bronze_medal];
    const medalImg = medals[place - 1] || medals[2];
    const medalClass = place <= 3 ? "medal-logo" : "medal-logo no-medal";
    const colorClass = place % 2 === 0 ? "medal-list even-color" : "medal-list odd-color";

    return (
        <li data-testid={`leaderboard-item-${index}`}>
            <div data-testid={`leaderboard-item-${index}-color`} className={`${colorClass}`}>
                {medalImg && <img className={medalClass} src={medalImg} alt={`${place} place medal`} />}
                <h3 className="medal-place">{place}.</h3>
                <h3 className="medal-user">{player.username}</h3>
                <h3 className="medal-elo">{player.elo}</h3>
            </div>
        </li>
    );
}
