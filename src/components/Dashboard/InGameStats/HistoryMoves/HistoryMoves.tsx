import arrow_point from "../../../../Images/Arrow Point.svg";
import { useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import HistoryItem from "../HistoryItem/HistoryItem";
import './HistoryMoves.css';
import { useGame } from "../../../../Providers/GameProvider/GameProvider";

/**
 * HistoryMoves component displays a list of chess moves in the current game.
 * It listens for changes in the game history and updates the displayed moves accordingly.
 *
 * @component
 * @returns {JSX.Element} The rendered HistoryMoves component.
 */
export default function HistoryMoves(): JSX.Element {
    const { history, gameMoves, setGameMoves } = useGame();
    const historyMovesContainerRef = useRef<HTMLUListElement>(null);

    /**
     * Formats the game history to update the moves displayed in the history list.
     * It checks the length of the history and adds the latest move to the gameMoves state.
     * If the move count is odd, it adds a white move. If even, it updates the last black move.
     */
    const formatHistory = useCallback(() => {
        if (history.length === 0) return;

        const lastMove = history[history.length - 1].to;
        const updatedMoves = [...gameMoves];
        const id = uuidv4();

        if (history.length % 2 === 1) {
            updatedMoves.push({ id, rowMoves: { whiteMove: lastMove, blackMove: "" } });
        } else {
            updatedMoves[updatedMoves.length - 1].rowMoves.blackMove = lastMove;
        }

        setGameMoves(updatedMoves);
        scrollToBottom();
    }, [history, setGameMoves]);

    /**
     * Scrolls the moves list container to the bottom to show the latest move.
     */
    const scrollToBottom = () => {
        if (historyMovesContainerRef.current) {
            historyMovesContainerRef.current.scrollTop = historyMovesContainerRef.current.scrollHeight;
        }
    };

    /**
     * UseEffect to reformat the history on every new move
     */
    useEffect(() => {
        formatHistory();
    }, [formatHistory]);

    return (
        <>
            <div className="moves-header">
                <img className="moves-icon" src={arrow_point} alt="Arrow Icon for game moves" />
                <h3 className="moves-header-text">Game Moves</h3>
            </div>

            <div className="moves-card">
                <ul className="moves-list" ref={historyMovesContainerRef}>
                    {gameMoves.map((move, index) => (
                        <HistoryItem key={move.id} rowMoves={move.rowMoves} index={index} />
                    ))}
                </ul>
            </div>
        </>
    );
}