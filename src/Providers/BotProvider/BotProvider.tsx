import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import { BotContextType, BotGame } from './BotProviderTypes';
import { GameMoves } from '../../components/Dashboard/InGameStats/InGameStatsTypes';
import { Move, Chess, Square } from 'chess.js';
import { useBotChessGame } from '../../Hooks/useBotChessGame/useBotChessGame';
import { useBotGameManagement } from '../../Hooks/useBotGameManagement/useBotGameManagement';

const BotContext = createContext<BotContextType | undefined>(undefined);

const helpSettings = {
    assisted: Infinity,
    friendly: 3,
    challenge: 0
};

/**
 * BotProvider component manages the state and logic for bot games, providing context to its child components.
 * It handles difficulty levels, game states, player actions, undo functionality, hints, and game cleanup.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will receive the bot context.
 * @returns {JSX.Element} The rendered BotProvider component with its context.
 */
export const BotProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {

    const [difficulty, setDifficulty] = useState<"novice" | "intermediate" | "advanced" | "master">("novice");
    const [help, setHelp] = useState<"assisted" | "friendly" | "challenge">("friendly");
    const [remainingUndos, setRemainingUndos] = useState<number>(helpSettings[help]);
    const [remainingHints, setRemainingHints] = useState<number>(helpSettings[help]);
    const [hint, setHint] = useState<[Square,Square] | null>(null);
    const [orientation, setOrientation] = useState<"w" | "b">("w");
    const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
    const [history, setHistory] = useState<Move[]>([]);
    const [botGame, setBotGame] = useState<BotGame | null>(null);
    const chess = useMemo(() => {
        const instance = new Chess();
    
        if (!botGame?.history || botGame.history.length === 0) {
            return instance;
        }
    
        instance.reset();
    
        for (const moveString of botGame.history) {
            let move = typeof moveString === "string" ? JSON.parse(moveString) : moveString;
    
            if (move && move.from && move.to) {
                const result = instance.move(move);
                if (!result) {
                    console.error("Invalid move:", move);
                    console.error("Current FEN:", instance.fen());
                    break;
                }
            } else {
                console.error("Invalid move format:", move);
            }
        }
        return instance;
    }, [botGame]);
    const [fen, setFen] = useState<string>("start");
    const [errorMove, setErrorMove] = useState<string | null>(null);
    const [gameMoves, setGameMoves] = useState<GameMoves[]>([]);

    const [loadingCreateGame, setLoadingCreateGame] = useState<boolean>(false);
    const [errorCreateGame, setErrorCreateGame] = useState<string | null>(null);
    const [successCreateGame, setSuccessCreateGame] = useState<string | null>(null);

    const [gameOver, setGameOver] = useState<string | null>(null);
    const [loadingOver, setLoadingOver] = useState<boolean>(false);
    const [errorOver, setErrorOver] = useState<string | null>(null);

    const [forfeitBotGame, setForfeitBotGame] = useState<boolean>(false);
    const [loadingForfeit, setLoadingForfeit] = useState<boolean>(false);
    const [errorForfeit, setErrorForfeit] = useState<string | null>(null);

    const [reconnectGame, setReconnectGame] = useState<boolean>(false);
    const [loadingReconnectGame, setLoadingReconnectGame] = useState<boolean>(false);
    const [errorReconnectGame, setErrorReconnectGame] = useState<string | null>(null);

    const [highlightedSquares, setHighlightedSquares] = useState<Record<string, any>>({});

    const { onDrop, undoPreviousMove, requestHint, findWinner, onSquareClick, onPromotionPieceSelect } = useBotChessGame({
        botGame, 
        setHistory, 
        setPlayerTurn, 
        orientation, 
        chess, 
        setFen,
        gameOver, 
        setGameOver,
        setErrorMove,
        setGameMoves,
        difficulty,
        remainingUndos,
        setRemainingUndos,
        remainingHints,
        setRemainingHints,
        setHint,
        setHighlightedSquares,
        help,
        reconnectGame 
    });

    /**
     * Resets the game state to its initial values.
     */
    const cleanup = useCallback(() => {
        setFen("start");
        setBotGame(null);
        setOrientation("w");
        setHistory([]);
        setGameMoves([]);
        setPlayerTurn("w");
        setGameOver(null);
        setHighlightedSquares({});
    }, []);

    /**
     * Reset state when the `help` setting changes.
     */
    useEffect(() => {
        setRemainingUndos(helpSettings[help]);
        setRemainingHints(helpSettings[help]);
        setHint(null);
    }, [help]);

    const { 
        handleCreateBotGame,
        handleForfeit,
        handleCloseBotGame,
        handleReconnectBotGame
    } = useBotGameManagement({
        cleanup,
        botGame,
        setBotGame,
        setFen,
        setHistory,
        setOrientation,
        setPlayerTurn,
        setLoadingCreateGame,
        setErrorCreateGame,
        setSuccessCreateGame,
        orientation,
        difficulty,
        help,
        setLoadingForfeit,
        setErrorForfeit,
        setForfeitBotGame,
        setErrorOver,
        setLoadingOver,
        findWinner,
        setErrorReconnectGame,
        setLoadingReconnectGame,
        setReconnectGame,
    });

    return (
        <BotContext.Provider value={{
            difficulty,
            setDifficulty,
            help,
            setHelp,
            orientation,
            setOrientation,
            botGame,
            setBotGame, 
            fen,
            setFen,
            gameOver,
            setGameOver,
            cleanup,
            chess,
            playerTurn,
            setPlayerTurn,
            history,
            setHistory,
            errorMove,
            setErrorMove,
            gameMoves,
            setGameMoves,
            onDrop,
            handleCreateBotGame,
            loadingCreateGame,
            errorCreateGame,
            successCreateGame,
            remainingUndos,
            undoPreviousMove,
            hint,
            requestHint,
            remainingHints,
            forfeitBotGame,
            setForfeitBotGame,
            handleForfeit,
            loadingForfeit,
            errorForfeit,
            handleCloseBotGame,
            loadingOver,
            errorOver,
            setErrorCreateGame,
            setSuccessCreateGame,
            highlightedSquares, 
            setHighlightedSquares,
            onSquareClick,
            onPromotionPieceSelect,
            handleReconnectBotGame,
            reconnectGame,
            setReconnectGame,
            loadingReconnectGame,
            errorReconnectGame
        }}>
            {children}
        </BotContext.Provider>
    );
};

/**
 * Custom hook to access the bot context. Ensures the `BotProvider` wraps the component tree.
 *
 * @returns {BotContextType} The current bot game context value.
 * @throws Will throw an error if called outside of a `BotProvider`.
 */
export const useBot = (): BotContextType => {
    const context = useContext(BotContext);
    if (context === undefined) {
        throw new Error('useBot must be used within a BotProvider');
    }
    return context;
};