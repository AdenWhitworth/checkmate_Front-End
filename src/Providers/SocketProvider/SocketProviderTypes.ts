import React, { ReactNode, MutableRefObject } from 'react';
import { Move } from "chess.js";
import { InGamePlayer, Opponent } from '../GameProvider/GameProviderTypes';
import { Socket } from 'socket.io-client';
import { Message } from '../../components/Dashboard/GameChat/GameChatTypes';
import { Game } from '../GameProvider/GameProviderTypes';
import { BotGame } from '../BotProvider/BotProviderTypes';
import { ActivePuzzle, LastPuzzle } from '../PlayerProvider/PlayerProviderTypes';
import { Puzzle } from '../PuzzleProvider/PuzzleProviderTypes';

/**
 * Represents the context type for the Socket Provider, which handles socket-based interactions
 * for various game-related features, such as managing game rooms, sending moves, puzzles, and bot interactions.
 *
 * @interface SocketContextType
 * @property {boolean} isConnected - Indicates if the socket is currently connected.
 * @property {string | null} errorSocket - Holds any error messages related to the socket connection.
 * @property {boolean} refresh - Indicates if a refresh is required.
 * @property {boolean} errorReconnect - Indicates if there was an error during socket reconnection.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setErrorReconnect - Function to update the errorReconnect state.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setRefresh - Function to update the refresh state.
 * @property {Function} sendAddUser - Sends a request to add a user to the socket connection.
 * @param {AddUserArgs} addUserArgs - Arguments required to add a user.
 * @returns {Promise<boolean>} Resolves to `true` if the user was successfully added, otherwise `false`.
 * @property {Function} connectSocket - Connects the socket with a provided access token.
 * @param {string} accessToken - The access token to authenticate the socket connection.
 * @returns {void}
 * @property {Function} disconnectSocket - Disconnects the current socket connection.
 * @returns {void}
 * @property {Function} sendCreateRoom - Sends a request to create a game room.
 * @param {CreateRoomArgs} createRoomArgs - Arguments required to create a game room.
 * @returns {Promise<{ game: Game } | null>} Resolves with the created game instance or `null` if creation fails.
 * @property {Function} sendJoinRoom - Sends a request to join a game room.
 * @param {JoinRoomArgs} joinRoomArgs - Arguments required to join a game room.
 * @returns {Promise<{ game: Game } | null>} Resolves with the joined game instance or `null` if joining fails.
 * @property {Function} sendCloseRoom - Sends a request to close a game room.
 * @param {CloseRoomArgs} closeRoomArgs - Arguments required to close a game room.
 * @returns {Promise<boolean>} Resolves to `true` if the room was successfully closed, otherwise `false`.
 * @property {Function} sendInGameMessage - Sends an in-game message through the socket connection.
 * @param {InGameMessageArgs} inGameMessageArgs - Arguments required to send the message.
 * @returns {Promise<boolean>} Resolves to `true` if the message was successfully sent, otherwise `false`.
 * @property {Function} sendMove - Sends a move in a game through the socket connection.
 * @param {MoveArgs} moveArgs - Arguments required to make a move.
 * @returns {Promise<boolean>} Resolves to `true` if the move was successfully made, otherwise `false`.
 * @property {Function} sendForfeit - Sends a forfeit request for the current game.
 * @param {ForfeitArgs} forfeitArgs - Arguments required to forfeit the game.
 * @returns {Promise<boolean>} Resolves to `true` if the game was successfully forfeited, otherwise `false`.
 * @property {string | null} responseMessage - Holds any response messages received from the server.
 * @property {MutableRefObject<Socket | null>} socketRef - A mutable reference object pointing to the active socket connection.
 * @property {Function} handleCallback - Handles the callback functions with a message and optional data.
 * @param {Function} callback - The callback function to handle.
 * @param {string} message - The message to pass to the callback.
 * @param {any} [data] - Optional additional data for the callback.
 * @returns {void}
 * @property {Function} sendReconnectRoom - Sends a request to rejoin a game room.
 * @param {ReconnectRoomArgs} reconnectRoomArgs - Arguments required to reconnect to a game room.
 * @returns {Promise<{ game: Game } | null>} Resolves with the reconnected game instance or `null` if reconnection fails.
 * @property {Function} sendGetBotMove - Sends a request to get the bot's next move.
 * @param {GetBotMoveArgs} getBotMoveArgs - Arguments required to fetch the bot's move.
 * @returns {Promise<{ botMove: Move }>} Resolves with the bot's calculated move.
 * @property {Function} sendCreateBotGame - Sends a request to create a bot game.
 * @param {CreateBotGameArgs} createBotGameArgs - Arguments required to create a bot game.
 * @returns {Promise<{ botGame: BotGame } | null>} Resolves with the created bot game instance or `null` if creation fails.
 * @property {Function} sendGetMoveHint - Sends a request to fetch a move hint.
 * @param {GetMoveHintArgs} getMoveHintArgs - Arguments required to get a move hint.
 * @returns {Promise<{ move: Move }>} Resolves with the suggested move as a hint.
 * @property {Function} sendCloseBotGame - Sends a request to close a bot game.
 * @param {CloseBotGameArgs} closeBotGameArgs - Arguments required to close a bot game.
 * @returns {Promise<boolean>} Resolves to `true` if the bot game was successfully closed, otherwise `false`.
 * @property {Function} sendReconnectBotGame - Sends a request to reconnect to a bot game.
 * @param {ReconnectBotGameArgs} reconnectBotGameArgs - Arguments required to reconnect to a bot game.
 * @returns {Promise<{ botGame: BotGame } | null>} Resolves with the reconnected bot game instance or `null` if reconnection fails.
 * @property {Function} sendStartPuzzle - Sends a request to start a puzzle game.
 * @param {StartPuzzleArgs} startPuzzleArgs - Arguments required to start a puzzle.
 * @returns {Promise<{ puzzle: Puzzle } | null>} Resolves with the puzzle instance if successful, or `null` if it fails.
 * @property {Function} sendClosePuzzle - Sends a request to close a puzzle.
 * @param {ClosePuzzleArgs} closePuzzleArgs - Arguments required to close a puzzle.
 * @returns {Promise<boolean>} Resolves to `true` if the puzzle was successfully closed, otherwise `false`.
 * @property {Function} sendReconnectPuzzle - Sends a request to reconnect to an active puzzle.
 * @param {ReconnectPuzzleArgs} reconnectPuzzleArgs - Arguments required to reconnect to a puzzle.
 * @returns {Promise<{ puzzle: Puzzle } | null>} Resolves with the reconnected puzzle instance or `null` if reconnection fails.
 */
export interface SocketContextType {
    isConnected: boolean;
    errorSocket: string | null;
    refresh: boolean;
    errorReconnect: boolean;
    setErrorReconnect: React.Dispatch<React.SetStateAction<boolean>>;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    sendAddUser: (addUserArgs: AddUserArgs) => Promise<boolean>;
    connectSocket: (accessToken: string) => void;
    disconnectSocket: () => void;
    sendCreateRoom: (createRoomArgs: CreateRoomArgs) => Promise<{ game: Game } | null>;
    sendJoinRoom: (joinRoomArgs: JoinRoomArgs) => Promise<{ game: Game } | null>;
    sendCloseRoom: (closeRoomArgs: CloseRoomArgs) => Promise<boolean>;
    sendInGameMessage: (inGameMessageArgs: InGameMessageArgs) => Promise<boolean>;
    sendMove: (moveArgs: MoveArgs) => Promise<boolean>;
    sendForfeit: (forfeitArgs: ForfeitArgs) => Promise<boolean>;
    responseMessage: string | null;
    socketRef: MutableRefObject<Socket | null>;
    handleCallback: (callback: Function, message: string, data?: any) => void;
    sendReconnectRoom: (reconnectRoomArgs: ReconnectRoomArgs) => Promise<{ game: Game } | null>;
    sendGetBotMove: ( getBotMoveArgs: GetBotMoveArgs) => Promise<{ botMove: Move }>;
    sendCreateBotGame: ( createBotGameArgs: CreateBotGameArgs) => Promise<{ botGame: BotGame } | null>;
    sendGetMoveHint: (getMoveHintArgs: GetMoveHintArgs) => Promise<{ move: Move }>;
    sendCloseBotGame: (closeBotGameArgs: CloseBotGameArgs) => Promise<boolean>;
    sendReconnectBotGame: (reconnectBotGameArgs: ReconnectBotGameArgs) => Promise<{ botGame: BotGame } | null>;
    sendStartPuzzle: (startPuzzleArgs: StartPuzzleArgs) => Promise<{puzzle: Puzzle} | null>;
    sendClosePuzzle: (closePuzzleArgs: ClosePuzzleArgs) => Promise<boolean>;
    sendReconnectPuzzle: (reconnectPuzzleArgs: ReconnectPuzzleArgs) => Promise<{puzzle: Puzzle} | null>;
}

/**
 * Represents the props for the Socket Provider component.
 * @interface SocketProviderProps
 * @property {string} url - The URL of the socket server.
 * @property {ReactNode} children - The children components wrapped by the provider.
 */
export interface SocketProviderProps {
    url: string;
    children: ReactNode;
}

/**
 * Represents the generic structure of a callback response.
 * @interface CallbackResponse
 * @property {string} message - The response message.
 * @property {boolean} error - Indicates whether there was an error in the response.
 */
export interface CallbackResponse {
    message: string;
    error: boolean;
}

/**
 * Represents the response received after creating a game room.
 * @interface CallbackResponseCreateRoom
 * @property {Game} game - The game created.
 */
export interface CallbackResponseCreateRoom extends CallbackResponse {
    game: Game;
}

/**
 * Represents the response received after joining a game room.
 * @interface CallbackResponseJoinRoom
 * @property {Game} game - The game joined.
 */
export interface CallbackResponseJoinRoom extends CallbackResponse {
    game: Game;
}

/**
 * Represents the response received after making a move in a game.
 * @interface CallbackResponseMove
 * @property {Game} game - The game which a move was made in.
 */
export interface CallbackResponseMove extends CallbackResponse {
    game: Game;
}

/**
 * Represents the response received after closing a game room.
 * @interface CallbackResponseCloseRoom
 * @property {Game} game - The game closed.
 */
export interface CallbackResponseCloseRoom extends CallbackResponse {
    game: Game;
}

/**
 * Represents the response received after reconnecting to a game room.
 * @interface CallbackResponseCloseRoom
 * @property {Game} game - The game reconnected to.
 */
export interface CallbackResponseReconnectRoom extends CallbackResponse {
    game: Game;
}

/**
 * Represents the response received after getting the bot's next move.
 * Extends the base `CallbackResponse` interface with specific properties for the bot move response.
 *
 * @interface CallbackResponseGetBotMove
 * @extends CallbackResponse
 * @property {Move} botMove - The next move determined by the bot.
 */
export interface CallbackResponseGetBotMove extends CallbackResponse {
    botMove: Move
}

/**
 * Represents the response received after creating a game against a bot.
 * Extends the base `CallbackResponse` interface with specific properties for the created bot game.
 *
 * @interface CallbackResponseCreateBotGame
 * @extends CallbackResponse
 * @property {BotGame} botGame - The details of the created bot game.
 */
export interface CallbackResponseCreateBotGame extends CallbackResponse {
    botGame: BotGame;
}

/**
 * Represents the response received after closing a bot game.
 * Extends the base `CallbackResponse` interface with specific properties for the closed bot game.
 *
 * @interface CallbackResponseCloseBotGame
 * @extends CallbackResponse
 * @property {BotGame} botGame - The details of the bot game that was closed.
 */
export interface CallbackResponseCloseBotGame extends CallbackResponse {
    botGame: BotGame;
}

/**
 * Represents the response received after getting a move hint from the bot.
 * Extends the base `CallbackResponse` interface with specific properties for the move hint response.
 *
 * @interface CallbackResponseGetMoveHint
 * @extends CallbackResponse
 * @property {Move} move - The suggested move as a hint for the player.
 */
export interface CallbackResponseGetMoveHint extends CallbackResponse {
    move: Move
}

/**
 * Represents the response received after attempting to reconnect to a bot game.
 *
 * @interface CallbackResponseReconnectBotGame
 * @extends CallbackResponse
 * @property {BotGame} botGame - The bot game object containing the game state and details of the reconnected game.
 */
export interface CallbackResponseReconnectBotGame extends CallbackResponse {
    botGame: BotGame;
}

/**
 * Represents the response received after attempting to start a puzzle game.
 *
 * @interface CallbackResponseStartPuzzle
 * @extends CallbackResponse
 * @property {Puzzle} puzzle - The puzzle game object containing the game state and details of the created puzzle.
 */
export interface CallbackResponseStartPuzzle extends CallbackResponse {
    puzzle: Puzzle;
}

/**
 * Represents the response received after attempting to reconnect to a puzzle game.
 *
 * @interface CallbackResponseReconnectPuzzle
 * @extends CallbackResponse
 * @property {Puzzle} puzzle - The puzzle game object containing the game state and details of the reconnected puzzle.
 */
export interface CallbackResponseReconnectPuzzle extends CallbackResponse {
    puzzle: Puzzle;
}

/**
 * Represents the arguments required to add a user to the socket.
 * @interface AddUserArgs
 * @property {string} username - The username of the player.
 * @property {string} userId - The userId of the player.
 */
export interface AddUserArgs {
    username: string;
    userId: string;
};

/**
 * Represents the arguments required to create a new game room.
 * 
 * @interface CreateRoomArgs
 * 
 * @property {Player} playerA - The player who initiates the creation of the game room (Player A).
 * @property {Player} playerB - The player who joins the game room (Player B).
 */
export interface CreateRoomArgs {
    playerA: InGamePlayer,
    playerB: InGamePlayer
}

/**
 * Represents the arguments required to join a game room.
 * @interface JoinRoomArgs
 * @property {string} gameId - The gameId of the game being joined.
 */
export interface JoinRoomArgs {
    gameId: string;
};

/**
 * Represents the arguments required to close a game room.
 * @interface CloseRoomArgs
 * @property {Game} game - The game object containing details of the game room that needs to be closed.
 * @property {boolean} inviteCancelled - Indicates whether the game was closed due to an invitation cancellation.
 * @property {Opponent} [opponent] - Optional information about the opponent player involved in the game.
 */
export interface CloseRoomArgs {
    game: Game;
    inviteCancelled: boolean;
    opponent?: Opponent;
};

/**
 * Represents the arguments required to reconnect a player to an existing game room.
 * @interface ReconnectRoomArgs
 * @property {string} gameId - The unique identifier of the game that the player is attempting to reconnect to.
 */
export interface ReconnectRoomArgs {
    gameId: string;
};

/**
 * Represents the arguments required by the opponent joining the game.
 * @interface CloseRoomArgs
 * @property {Game} game - The game joined by the opponent.
 */
export interface OpponentJoinedArgs {
    game: Game, 
};

/**
 * Represents the arguments required to send an in-game message.
 * @interface InGameMessageArgs
 * @property {Message} inGameMessage - The message being sent in the game.
 */
export interface InGameMessageArgs {
    inGameMessage: Message
}

/**
 * Represents the arguments required to make a move in a game.
 * @interface MoveArgs
 * @property {Game} game - The game object containing details about the current game session, including player details, game state, and game ID.
 * @property {Move} move - The move being made in the game. This includes information such as the piece being moved, its starting and ending squares, and any additional move details.
 * @property {Move[]} history - The complete move history of the current game. Each move is represented as an object containing move details, stored in the format provided by chess.js.
 * @property {string} fen - The current board position in FEN (Forsyth-Edwards Notation) format, representing the game state after the most recent move.
 * @property {"w" | "b"} currentTurn - Indicates which player's turn it is to make a move: "w" for white or "b" for black.
 */
export interface MoveArgs {
    game: Game; 
    move: Move;
    history: Move[];
    fen: string;
    currentTurn: "w" | "b";
};

/**
 * Represents the arguments required to forfeit a game.
 * @interface ForfeitArgs
 * @property {Game} game - The game room being forfeited.
 * @property {string} username - The username of the player forfeiting the game.
 */
export interface ForfeitArgs {
    game: Game, 
    username: string
};

/**
 * Represents the arguments received when a player disconnects.
 * @interface DisconnectArgs
 * @property {Game} game - The game object containing details about the current game session, including player information, game state, and game ID.
 * @property {string} disconnectUserId - The unique identifier of the player who disconnected from the game.
 */
export interface DisconnectArgs {
    game: Game,
    disconnectUserId: string;
};

/**
 * Represents the arguments received when a player reconnects to an existing game.
 * @interface RoomReconnectedArgs
 * @property {Game} game - The game object containing details about the current game session, including player information, game state, and game ID.
 * @property {string} connectUserId - The unique identifier of the player who has reconnected to the game.
 */
export interface RoomReconnectedArgs {
    game: Game,
    connectUserId: string;
};

/**
 * Represents the arguments required to request the bot's next move in the current game.
 *
 * @interface GetBotMoveArgs
 * @property {BotGame} botGame - The game object containing details about the current game session, such as player information, game state, and game ID.
 * @property {"novice" | "intermediate" | "advanced" | "master"} difficulty - The bot's difficulty level, determining the complexity of its decisions.
 * @property {string} fen - The current board position in FEN (Forsyth–Edwards Notation) format, representing the game state after the most recent move.
 * @property {"w" | "b"} currentTurn - Indicates whose turn it is to play: `"w"` for white or `"b"` for black.
 * @property {Move[]} history - An array of moves made so far in the game, providing a complete record of the game’s progression.
 */
export interface GetBotMoveArgs {
    botGame: BotGame;
    difficulty: "novice" | "intermediate" | "advanced" | "master";
    fen: string;
    currentTurn: "w" | "b";
    history: Move[];
}

/**
 * Represents the arguments required to create a new game against a bot.
 *
 * @interface CreateBotGameArgs
 * @property {InGamePlayer} playerA - The player initiating the game (Player A), including their details and orientation.
 * @property {InGamePlayer} playerB - The bot player (Player B), including its details and orientation.
 * @property {"novice" | "intermediate" | "advanced" | "master"} difficulty - The bot's difficulty level.
 * @property {"assisted" | "friendly" | "challenge"} help - The level of assistance available to the player during the game.
 */
export interface CreateBotGameArgs {
    playerA: InGamePlayer;
    playerB: InGamePlayer;
    difficulty: "novice" | "intermediate" | "advanced" | "master";
    help: "assisted" | "friendly" | "challenge";
}

/**
 * Represents the arguments required to close an active bot game.
 *
 * @interface CloseBotGameArgs
 * @property {BotGame} botGame - The game object representing the bot game session that needs to be closed.
 */
export interface CloseBotGameArgs {
    botGame: BotGame;
}

/**
 * Represents the arguments required to request a move hint for the current game.
 *
 * @interface GetMoveHintArgs
 * @property {string} fen - The current board position in FEN (Forsyth–Edwards Notation) format, representing the game state after the most recent move.
 * @property {"w" | "b"} currentTurn - Indicates whose turn it is to play: `"w"` for white or `"b"` for black.
 */
export interface GetMoveHintArgs {
    fen: string;
    currentTurn: "w" | "b";
    history: Move[];
}

/**
 * Represents the arguments required to reconnect to an existing bot game.
 *
 * @interface ReconnectBotGameArgs
 * @property {string} gameId - The unique identifier of the bot game to reconnect to.
 */
export interface ReconnectBotGameArgs {
    gameId: string;
}

/**
 * Represents the arguments required to start a new chess puzzle.
 *
 * @interface StartPuzzleArgs
 * @property {"easy" | "medium" | "hard"} difficulty - The difficulty level of the puzzle to start.
 * @property {LastPuzzle} lastPuzzle - An object containing the last completed puzzle number for each difficulty.
 */
export interface StartPuzzleArgs {
    difficulty: "easy" | "medium" | "hard";
    lastPuzzle: LastPuzzle;
}

/**
 * Represents the arguments required to close a chess puzzle.
 *
 * @interface ClosePuzzleArgs
 * @property {"easy" | "medium" | "hard"} difficulty - The difficulty level of the puzzle being closed.
 * @property {string} puzzleId - The unique identifier of the puzzle being closed.
 * @property {number} timeToComplete - The time taken to complete the puzzle, in seconds.
 */
export interface ClosePuzzleArgs {
    difficulty: "easy" | "medium" | "hard";
    puzzleId: string;
    timeToComplete: number;
}

/**
 * Represents the arguments required to reconnect to an active puzzle.
 *
 * @interface ReconnectPuzzleArgs
 * @property {ActivePuzzle} activePuzzle - The currently active puzzle details, including its ID, difficulty, number, and start time.
 */
export interface ReconnectPuzzleArgs {
    activePuzzle: ActivePuzzle;
}