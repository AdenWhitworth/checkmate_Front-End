import React, { ReactNode } from 'react';

export interface SocketContextType {
    isConnected: boolean;
    errorSocket: string | null;
    refresh: boolean;
    errorReconnect: boolean;
    setErrorReconnect: React.Dispatch<React.SetStateAction<boolean>>;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    sendAddUser: (addUserArgs: AddUserArgs) => void;
    //sendRemoveUser: (user_id: string) => void;
    //sendCheckSocket: (user_id: string) => void;
    connectSocket: (accessToken: string) => void;
    disconnectSocket: () => void;
    sendCreateRoom: () => void;
    sendJoinRoom: (joinRoomArgs: JoinRoomArgs) => void;
    sendCloseRoom: (closeRoomArgs: CloseRoomArgs) => void;
    sendInGameMessage: (inGameMessageArgs: InGameMessageArgs) => void;
    sendMove: (moveArgs: MoveArgs) => void;
    sendForfeit: (forfeitArgs: ForfeitArgs) => void;
    responseMessage: string | null;
}

export interface SocketProviderProps {
    url: string;
    children: ReactNode;
}

export interface CallbackResponse {
    message: string;
}

export interface CallbackResponseCreateRoom extends CallbackResponse {
    room: Room;
}

export interface CallbackResponseJoinRoom extends CallbackResponse {
    room: Room;
}

export interface CallbackResponseMove extends CallbackResponse {
    move: string;
}

export interface CallbackResponseCloseRoom extends CallbackResponse {
    room: Room;
}

export interface ErrorResponse {
    error: boolean;
    message: string;
}

export interface Player {
    id: string;
    username: string;
};

export interface Room {
    roomId: string;
    players: Player[];
};

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
    move: string
};

export interface ForfeitArgs {
    room: Room, 
    username: string
};

export interface DisconnectArgs {
    player: Player
};