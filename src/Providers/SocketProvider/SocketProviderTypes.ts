import React, { ReactNode, MutableRefObject } from 'react';
import { Move } from "chess.js";
import { SocketPlayer, Room } from '../GameProvider/GameProviderTypes';
import { Socket } from 'socket.io-client';

export interface SocketContextType {
    isConnected: boolean;
    errorSocket: string | null;
    refresh: boolean;
    errorReconnect: boolean;
    setErrorReconnect: React.Dispatch<React.SetStateAction<boolean>>;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    sendAddUser: (addUserArgs: AddUserArgs) => Promise<boolean>;
    //sendRemoveUser: (user_id: string) => void;
    //sendCheckSocket: (user_id: string) => void;
    connectSocket: (accessToken: string) => void;
    disconnectSocket: () => void;
    sendCreateRoom: () => Promise<{ room: Room } | null>;
    sendJoinRoom: (joinRoomArgs: JoinRoomArgs) => Promise<boolean>;
    sendCloseRoom: (closeRoomArgs: CloseRoomArgs) => Promise<boolean>;
    sendInGameMessage: (inGameMessageArgs: InGameMessageArgs) => Promise<boolean>;
    sendMove: (moveArgs: MoveArgs) => Promise<boolean>;
    sendForfeit: (forfeitArgs: ForfeitArgs) => Promise<boolean>;
    responseMessage: string | null;
    socketRef: MutableRefObject<Socket | null>;
}

export interface SocketProviderProps {
    url: string;
    children: ReactNode;
}

export interface CallbackResponse {
    message: string;
    error: boolean;
}

export interface CallbackResponseCreateRoom extends CallbackResponse {
    room: Room;
}

export interface CallbackResponseJoinRoom extends CallbackResponse {
    room: Room;
}

export interface CallbackResponseMove extends CallbackResponse {
    move: Move;
}

export interface CallbackResponseCloseRoom extends CallbackResponse {
    room: Room;
}

export interface Message {
    message: string;
    time: string;
    username: string;
    room: Room;
    messageError: boolean;
}

export interface AddUserArgs {
    username: string
};

export interface JoinRoomArgs {
    room: Room
};

export interface CloseRoomArgs {
    room: Room, 
};

export interface InGameMessageArgs {
    inGameMessage: Message
}

export interface MoveArgs {
    room: Room, 
    move: Move
};

export interface ForfeitArgs {
    room: Room, 
    username: string
};

export interface DisconnectArgs {
    player: SocketPlayer
};