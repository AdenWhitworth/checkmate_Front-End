import king from "../../../../Images/King yellow.svg";
import trophy from "../../../../Images/trophy green.svg";
import shield from "../../../../Images/shield grey.svg";
import flag from "../../../../Images/flag red.svg";
import arrow from "../../../../Images/Arrow Point.svg";
import { usePlayer } from "../../../../Providers/PlayerProvider/PlayerProvider";
import { Timestamp } from "firebase/firestore";
import "./GamesItem.css";
import { GamesItemProps, GameStates, GameState } from "./GameItemTypes";

const gameStates: GameStates = {
    win: {
        srcImg: trophy,
        text: "Won"
    },
    draw: {
        srcImg: shield,
        text: "Draw"
    },
    loss: {
        srcImg: flag,
        text: "Lost"
    }
}

/**
 * Component to render a single game item in the list of played games.
 *
 * @param {GamesItemProps} props - The props for the GamesItem component.
 * @param {Game} props.game - The game object containing details about the chess game.
 * @param {number} props.index - The index of the game in the games list.
 *
 * @returns {JSX.Element} The rendered GamesItem component.
 */
export default function GamesItem({
    game, 
    index
}: GamesItemProps): JSX.Element {

    const { playerStatic } = usePlayer();
    const colorClass = index % 2 === 0 ? "games-item even-color" : "games-item odd-color";

    const isPlayerAWhite = game.playerA.orientation === "w";

    const isPlayerA = game.playerA.userId === playerStatic?.userId;

    /**
     * Determines the result of the game for the current player.
     *
     * @returns {GameState} The game state object representing win, draw, or loss.
     */
    const determineResult = (): GameState => {
        if(game.winner === "playerA"){
            return gameStates[isPlayerA? "win" : "loss"];
        } else if (game.winner === "playerB") {
            return gameStates[isPlayerA? "loss" : "win"];
        } else {
            return gameStates.draw;
        }
    }

    /**
     * Formats a Firebase timestamp into a MM/DD/YYYY string.
     *
     * @param {Timestamp | null | undefined} timestamp - The Firebase timestamp to format.
     * @returns {string} The formatted date string or an empty string if the timestamp is null/undefined.
     */
    const formatDate = (timestamp: Timestamp | null | undefined): string => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    return (
        <li>
            <div className={`${colorClass}`}>
                <div className="games-king">
                    <img  src={king} alt="King game icon"></img>
                </div>
                
                <div className="games-players">
                    <div className="games-player">
                        <div className="white-square"></div>
                        <h6>{isPlayerAWhite? game.playerA.username : game.playerB.username}</h6>
                    </div>

                    <div className="games-player">
                        <div className="black-square"></div>
                        <h6>{isPlayerAWhite? game.playerB.username : game.playerA.username}</h6>
                    </div>
                </div>
                
                <div className="games-result">
                    <div className="games-result-icon">
                        <img  src={determineResult().srcImg} alt="Game result icon"></img>
                    </div>
                    
                    <h5>{determineResult().text}</h5>
                </div>

                <div className="games-moves">
                    <div className="games-moves-icon">
                        <img  src={arrow} alt="Game moves icon"></img>
                    </div>
                    <h5>{game.history.length}</h5>
                </div>

                <h5 className="games-created">{formatDate(game.createdAt)}</h5> 

            </div>
        </li>
    );
}