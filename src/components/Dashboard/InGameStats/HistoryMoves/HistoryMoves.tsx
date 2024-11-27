import arrow_point from "../../../../Images/Arrow Point.svg";
import { useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import HistoryItem from "./HistoryItem/HistoryItem";
import './HistoryMoves.css';
import { HistorMovesProps } from "./HistoryMovesTypes";

/**
 * HistoryMoves component displays a list of chess moves in the current game.
 * It listens for changes in the game history and updates the displayed moves accordingly.
 *
 * @component
 * @returns {JSX.Element} The rendered HistoryMoves component.
 */
export default function HistoryMoves({history, gameMoves, setGameMoves}: HistorMovesProps): JSX.Element {
    const historyMovesContainerRef = useRef<HTMLUListElement>(null);

    /**
     * Formats the game history to update the moves displayed in the history list.
     * It checks if history needs to be repopulated after rejoining.
     * It checks the length of the history and adds the latest move to the gameMoves state.
     * If the move count is odd, it adds a white move. If even, it updates the last black move.
     */
    const formatHistory = useCallback(() => {
        if (history.length === 0) return;
    
        setGameMoves((prevMoves) => {
            const updatedMoves = [...prevMoves];
    
            // If gameMoves is empty, rebuild the entire history from scratch (e.g., after rejoining)
            if (updatedMoves.length === 0) {
                history.forEach((move, index) => {
                    const id = uuidv4();
                    if (index % 2 === 0) {
                        updatedMoves.push({ id, rowMoves: { 
                            whiteMove: move.to, 
                            whitePiece: move.piece,
                            blackMove: "",
                            blackPiece: null,
                        } });
                    } else {
                        updatedMoves[updatedMoves.length - 1].rowMoves.blackMove = move.to;
                        updatedMoves[updatedMoves.length - 1].rowMoves.blackPiece = move.piece;
                    }
                });
            } else {
                // Only add the latest move if gameMoves is already populated
                const existingMovesCount = updatedMoves.reduce(
                    (count, move) => count + (move.rowMoves.blackMove ? 2 : 1),
                    0
                );
    
                if (history.length > existingMovesCount) {
                    const lastMove = history[existingMovesCount];
                    const id = uuidv4();
    
                    if (existingMovesCount % 2 === 0) {
                        updatedMoves.push({ id, rowMoves: { 
                            whiteMove: lastMove.to, 
                            whitePiece: lastMove.piece,
                            blackMove: "",
                            blackPiece: null,
                        } });
                    } else {
                        updatedMoves[updatedMoves.length - 1].rowMoves.blackMove = lastMove.to;
                        updatedMoves[updatedMoves.length - 1].rowMoves.blackPiece = lastMove.piece;
                    }
                }
            }
    
            scrollToBottom();
            return updatedMoves;
        });
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
    }, [history, formatHistory]);

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