import React, { ReactNode, MutableRefObject } from 'react';
import { Move } from "chess.js";
import { InGamePlayer, Opponent } from '../GameProvider/GameProviderTypes';
import { Socket } from 'socket.io-client';
import { Message } from '../../components/Dashboard/GameChat/GameChatTypes';
import { Game } from '../GameProvider/GameProviderTypes';

/**
 * Represents the context type for the Socket Provider.
 * @interface SocketContextType
 * @property {boolean} isConnected - Indicates if the socket is currently connected.
 * @property {string | null} errorSocket - Holds any error messages related to the socket connection.
 * @property {boolean} refresh - Indicates if a refresh is required.
 * @property {boolean} errorReconnect - Indicates if there was an error during socket reconnection.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setErrorReconnect - Function to set the errorReconnect state.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setRefresh - Function to set the refresh state.
 * @property {Function} sendAddUser - Sends a request to add a user to the socket connection.
 * @property {Function} connectSocket - Connects the socket with a provided access token.
 * @property {Function} disconnectSocket - Disconnects the current socket connection.
 * @property {Function} sendCreateRoom - Sends a request to create a game room.
 * @property {Function} sendJoinRoom - Sends a request to join a game room.
 * @property {Function} sendCloseRoom - Sends a request to close a game room.
 * @property {Function} sendInGameMessage - Sends an in-game message through the socket connection.
 * @property {Function} sendMove - Sends a move in a game through the socket connection.
 * @property {Function} sendForfeit - Sends a forfeit request for the current game.
 * @property {string | null} responseMessage - Holds any response messages received from the server.
 * @property {MutableRefObject<Socket | null>} socketRef - A mutable reference object pointing to the active socket connection.
 * @property {Function} handleCallback - Handles the callback functions with a message and optional data.
 * @property {Function} sendReconnectRoom - Sends a request to rejoin a game room.
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