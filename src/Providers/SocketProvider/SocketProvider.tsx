import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../AuthProvider/AuthProvider';
import { 
    SocketContextType, 
    SocketProviderProps,
    CallbackResponseCreateRoom,
    CallbackResponseJoinRoom,
    CallbackResponseCloseRoom,
    CallbackResponseMove,
    AddUserArgs,
    JoinRoomArgs,
    CloseRoomArgs,
    InGameMessageArgs,
    MoveArgs,
    ForfeitArgs,
    DisconnectArgs
} from './SocketProviderTypes';
import { usePlayer } from '../PlayerProvider/PlayerProvider';
import { CallbackResponse } from './SocketProviderTypes';
import { Room } from '../GameProvider/GameProviderTypes';

const SocketContext: React.Context<SocketContextType | undefined> = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const handleCallback = (callback: Function, message: string, data?: any) => {
    callback({ message, ...data });
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ url, children }: SocketProviderProps): JSX.Element => {
  const [isConnected, setIsConnected] = useState(false);
  const [errorSocket, setErrorSocket] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [errorReconnect, setErrorReconnect] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const {currentUser, accessToken} = useAuth();
  const { player } = usePlayer();

  const sendAddUser = useCallback((addUserArgs: AddUserArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current) {
        socketRef.current.emit('addUser', addUserArgs, (response: CallbackResponse) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(false);
          } else {
            setResponseMessage(response.message);
            resolve(true);
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, []);

  const sendCreateRoom = useCallback((): Promise<{ room: Room } | null> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("createRoom", (response: CallbackResponseCreateRoom) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({ room: response.room });
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(new Error('Socket is not connected'));
      }
    });
  }, [isConnected]);

  const sendJoinRoom = useCallback((joinRoomArgs: JoinRoomArgs): Promise<{ room: Room } | null> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("joinRoom", joinRoomArgs, (response: CallbackResponseJoinRoom) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({ room: response.room });
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(new Error('Socket is not connected'));
      }
    });
  }, [isConnected]);

  const sendCloseRoom = useCallback((closeRoomArgs: CloseRoomArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("closeRoom", closeRoomArgs, (response: CallbackResponseCloseRoom) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(false);
          } else {
            setResponseMessage(response.message);
            resolve(true);
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, [isConnected]);

  const sendInGameMessage = useCallback((inGameMessageArgs: InGameMessageArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("inGameMessage", inGameMessageArgs, (response: CallbackResponse) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(false);
          } else {
            setResponseMessage(response.message);
            resolve(true);
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, [isConnected]);

  const sendMove = useCallback((moveArgs: MoveArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("move", moveArgs, (response: CallbackResponseMove) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(false);
          } else {
            setResponseMessage(response.message);
            resolve(true);
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, [isConnected]);
      
  const sendForfeit = useCallback((forfeitArgs: ForfeitArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
          socketRef.current.emit("playerForfeited", forfeitArgs, (response: CallbackResponse) => {
            if (response.error) {
              setResponseMessage(response.message);
              reject(false);
            } else {
              setResponseMessage(response.message);
              resolve(true);
            }
          });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, [isConnected]);

  const connectSocket = useCallback((accessToken: string) => {
    if (socketRef.current || !player) return;

    const socketInstance = io(url, {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', async () => {
      try {
        if (!player) throw Error("Player required for adding username") 
        await sendAddUser({ username: player.username});
        setIsConnected(true);
        setErrorSocket(null);
      } catch (error) {
        setIsConnected(false);
        setErrorSocket("Add username error");
      }
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setErrorSocket(null);
    });

    socketInstance.on('connect_error', (err) => {
      setErrorSocket('Connection error');
      console.error('Connection error:', err);
    });

    socketInstance.on('error', (err) => {
      setErrorSocket('Socket error');
      setErrorReconnect(true);
      console.error('Socket error:', err);
    });

    socketInstance.on('reconnect_attempt', () => {
    });

    socketInstance.on('reconnect_error', (err) => {
      console.error('Reconnection error:', err);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      setErrorReconnect(true);
    });
    
    socketInstance.on('inGameMessage', (inGameMessageArgs: InGameMessageArgs, callback) => {
        handleCallback(callback, 'Message recieved by opponent');
        console.log(inGameMessageArgs);
    });
  }, [url, player]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setErrorSocket(null);
    }
  }, []);

  useEffect(() => {
    if (currentUser && accessToken && player) {
      disconnectSocket();
      connectSocket(accessToken);
    }

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, currentUser, player]);

  /*
  const sendRemoveUser = useCallback((user_id: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('removeUser', user_id, (response: any) => {
        if (response.error) {
          setErrorSocket('Remove user error');
          console.error('Remove user error:', response.message);
        } else {
          setErrorSocket(null);
          disconnectSocket();
        }
      });
    } else {
      setErrorSocket('Socket is not connected');
      console.error('Socket is not connected');
    }
  }, [isConnected, disconnectSocket]);

  const sendCheckSocket = useCallback((user_id: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('checkSocket', user_id, (response: any) => {
        if (response.error) {
          setErrorSocket(response.message);
          console.error('Check Socket Error:', response.message);
          setIsConnected(false);
        } else {
          setErrorSocket(null);
        }
      });
    } else {
      setErrorSocket('Socket is not connected');
      setIsConnected(false);
      console.error('Socket is not connected');
    }
  }, [isConnected]);
  */
  return (
    <SocketContext.Provider value={{
      isConnected, errorSocket, refresh, errorReconnect, setErrorReconnect, setRefresh,
      sendAddUser, sendCreateRoom, sendJoinRoom, sendCloseRoom, sendInGameMessage, connectSocket, 
      disconnectSocket, sendMove, sendForfeit, responseMessage, socketRef
    }}>
      {children}
    </SocketContext.Provider>
  );
};