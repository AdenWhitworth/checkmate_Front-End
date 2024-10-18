import arrow_point from "../../../../Images/Arrow Point.svg";
import {useState, useEffect, useRef} from "react";
import {v4 as uuidv4} from "uuid";
import HistoryItem from "../HistoryItem/HistoryItem";
import './HistoryMoves.css';
import { GameMoves } from "../InGameStatsTypes";
import { useGame } from "../../../../Providers/GameProvider/GameProvider";

export default function HistoryMoves() {
    const [gameMoves, setGameMoves] = useState<GameMoves[]>([]);
    const { history } = useGame();
    const history_moves_container = useRef<HTMLUListElement>(null); 

    const formatHistory = () => {
        const historyLength = history.length;
        if (!historyLength) return;
    
        const lastMove = history[historyLength - 1].to;
        const gameMovesCopy = [...gameMoves];
        const id = uuidv4();
    
        if (historyLength % 2 === 1) {
            gameMovesCopy.push({ id, rowMoves: { whiteMove: lastMove, blackMove: "" } });
        } else {
            gameMovesCopy[gameMovesCopy.length - 1].rowMoves.blackMove = lastMove;
        }
    
        setGameMoves(gameMovesCopy);
    };

    const scrollToBottom = () => {
        if (history_moves_container.current) {
            history_moves_container.current.scrollTop = history_moves_container.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (gameMoves.length > 0) {
            scrollToBottom();
        }
    }, [gameMoves.length]);

    useEffect(() => {
        formatHistory();
    }, [history]);

    return (
        <>
            <div className="moves-header">
                <img className="moves-icon" src={arrow_point} alt="Arrow Icon for game moves" />
                <h3 className="moves-header-text">Game Moves</h3>
            </div>

            <div className="moves-card">
                <ul className="moves-list" ref={history_moves_container}>
                    {gameMoves.map((gameMoves, index) => (
                        <HistoryItem key={gameMoves.id} rowMoves={gameMoves.rowMoves} index={index}></HistoryItem>
                    ))}
                </ul>
            </div>
        </>
    );
}