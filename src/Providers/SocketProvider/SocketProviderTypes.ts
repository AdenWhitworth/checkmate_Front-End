import React, { ReactNode, MutableRefObject } from 'react';
import { Move } from "chess.js";
import { SocketPlayer, Room } from '../GameProvider/GameProviderTypes';
import { Socket } from 'socket.io-client';
import { Message } from '../../components/Dashboard/GameChat/GameChatTypes';

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
    sendCreateRoom: () => Promise<{ room: Room } | null>;
    sendJoinRoom: (joinRoomArgs: JoinRoomArgs) => Promise<{ room: Room } | null>;
    sendCloseRoom: (closeRoomArgs: CloseRoomArgs) => Promise<boolean>;
    sendInGameMessage: (inGameMessageArgs: InGameMessageArgs) => Promise<boolean>;
    sendMove: (moveArgs: MoveArgs) => Promise<boolean>;
    sendForfeit: (forfeitArgs: ForfeitArgs) => Promise<boolean>;
    responseMessage: string | null;
    socketRef: MutableRefObject<Socket | null>;
    handleCallback: (callback: Function, message: string, data?: any) => void;
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
 * @property {Room} room - The game room created.
 */
export interface CallbackResponseCreateRoom extends CallbackResponse {
    room: Room;
}

/**
 * Represents the response received after joining a game room.
 * @interface CallbackResponseJoinRoom
 * @property {Room} room - The game room joined.
 */
export interface CallbackResponseJoinRoom extends CallbackResponse {
    room: Room;
}

/**
 * Represents the response received after making a move in a game.
 * @interface CallbackResponseMove
 * @property {Move} move - The move made in the game.
 */
export interface CallbackResponseMove extends CallbackResponse {
    move: Move;
}

/**
 * Represents the response received after closing a game room.
 * @interface CallbackResponseCloseRoom
 * @property {Room} room - The game room that was closed.
 */
export interface CallbackResponseCloseRoom extends CallbackResponse {
    room: Room;
}

/**
 * Represents the arguments required to add a user to the socket.
 * @interface AddUserArgs
 * @property {string} username - The username of the player.
 */
export interface AddUserArgs {
    username: string
};

/**
 * Represents the arguments required to join a game room.
 * @interface JoinRoomArgs
 * @property {Room} room - The game room to join.
 */
export interface JoinRoomArgs {
    room: Room
};

/**
 * Represents the arguments required to close a game room.
 * @interface CloseRoomArgs
 * @property {Room} room - The game room to close.
 */
export interface CloseRoomArgs {
    room: Room, 
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
 * @property {Room} room - The game room where the move is being made.
 * @property {Move} move - The move being made in the game.
 */
export interface MoveArgs {
    room: Room, 
    move: Move
};

/**
 * Represents the arguments required to forfeit a game.
 * @interface ForfeitArgs
 * @property {Room} room - The game room being forfeited.
 * @property {string} username - The username of the player forfeiting the game.
 */
export interface ForfeitArgs {
    room: Room, 
    username: string
};

/**
 * Represents the arguments received when a player disconnects.
 * @interface DisconnectArgs
 * @property {SocketPlayer} player - The player who disconnected.
 */
export interface DisconnectArgs {
    player: SocketPlayer
};