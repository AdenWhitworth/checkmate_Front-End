import gold_medal from "../../../../../Images/Gold Medal.svg";
import silver_medal from "../../../../../Images/Silver Medal.svg";
import bronze_medal from "../../../../../Images/Bronze Medal.svg";
import { LeaderBoardItemProps } from "./LeaderBoardItemTypes";
import './LeaderBoardItem.css';

export default function LeaderBoardItem({
    player, 
    index
}: LeaderBoardItemProps) {

    const place = index + 1;

    const medals = [gold_medal, silver_medal, bronze_medal];
    const medalImg = medals[place - 1] || medals[2];
    const medalClass = place <= 3 ? "medal-logo" : "medal-logo no-medal";
    const colorClass = place % 2 === 0 ? "medal-list even-color" : "medal-list odd-color";

    return (
        <li>
            <div className={`${colorClass}`}>
                {medalImg && <img className={medalClass} src={medalImg} alt={`${place} place medal`} />}
                <h3 className="medal-place">{place}.</h3>
                <h3 className="medal-user">{player.username}</h3>
                <h3 className="medal-wins">Win: {player.win}</h3>
                <h3 className="medal-lost">Loss: {player.loss}</h3>
            </div>
        </li>
    );
}
