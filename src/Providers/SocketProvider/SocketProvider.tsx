import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
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
  CreateRoomArgs,
  ReconnectRoomArgs,
  CallbackResponseReconnectRoom,
  GetBotMoveArgs,
  CallbackResponseGetBotMove,
  CreateBotGameArgs,
  CallbackResponseCreateBotGame,
  CallbackResponseGetMoveHint,
  GetMoveHintArgs,
  CloseBotGameArgs
} from './SocketProviderTypes';
import { usePlayer } from '../PlayerProvider/PlayerProvider';
import { CallbackResponse } from './SocketProviderTypes';
import { Game } from '../GameProvider/GameProviderTypes';
import { Move } from 'chess.js';
import { BotGame } from '../BotProvider/BotProviderTypes';

const SocketContext: React.Context<SocketContextType | undefined> = createContext<SocketContextType | undefined>(undefined);

/**
 * Socket Provider that handles WebSocket connections using Socket.io.
 * It provides functions to send and manage socket events related to a multiplayer game.
 * 
 * @param {SocketProviderProps} props - The properties required by the SocketProvider.
 * @returns {JSX.Element} The rendered JSX for the SocketProvider context.
 */
export const SocketProvider = ({ url, children }: SocketProviderProps): JSX.Element => {
  const [isConnected, setIsConnected] = useState(false);
  const [errorSocket, setErrorSocket] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [errorReconnect, setErrorReconnect] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const {currentUser, accessToken} = useAuth();
  const { playerStatic } = usePlayer();

  /**
   * Handles executing a callback function with a given message and optional data.
   * 
   * @param {Function} callback - The callback function to be executed.
   * @param {string} message - The message to be sent with the callback.
   * @param {Object} [data] - Optional additional data to be sent with the callback.
   */
  const handleCallback = useCallback((callback: Function, message: string, data?: any) => {
    callback({ message, ...data });
  }, []);

  /**
   * Sends a request to add a user to the current session via the socket.
   * 
   * @param {AddUserArgs} addUserArgs - The user information required to add a user to the session.
   * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
   */
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

  /**
   * Sends a request to create a game room via the socket.
   * 
   * @param {CreateRoomArgs} createRoomArgs - The arguments required to create a new game, including player details.
   * @returns {Promise<{ room: Room } | null>} A promise that resolves to an object with the created game information, or null on failure.
   */
  const sendCreateRoom = useCallback((createRoomArgs: CreateRoomArgs): Promise<{ game: Game } | null> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("createRoom", createRoomArgs, (response: CallbackResponseCreateRoom) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({ game: response.game });
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(new Error('Socket is not connected'));
      }
    });
  }, [isConnected]);

  /**
   * Sends a request to join an existing game room via the socket.
   * 
   * @param {JoinRoomArgs} joinRoomArgs - The information required to join a room.
   * @returns {Promise<{ game: Game } | null>} A promise that resolves to an object with the joined room information, or null on failure.
   */
  const sendJoinRoom = useCallback((joinRoomArgs: JoinRoomArgs): Promise<{ game: Game } | null> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("joinRoom", joinRoomArgs, (response: CallbackResponseJoinRoom) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({ game: response.game });
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(new Error('Socket is not connected'));
      }
    });
  }, [isConnected]);

  /**
   * Sends a request to close an existing game room via the socket.
   * 
   * @param {CloseRoomArgs} closeRoomArgs - The information required to close a room.
   * @returns {Promise<boolean>} A promise that resolves to true if successful, false otherwise.
   */
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

  /**
   * Sends a request to rejoin an existing game room via the socket.
   * 
   * @param {ReconnectRoomArgs} reconnectRoomArgs - The information required to rejoin a room.
   * @returns {Promise<{ game: Game } | null>} A promise that resolves to an object with the joined room information, or null on failure.
   */
  const sendReconnectRoom = useCallback((reconnectRoomArgs: ReconnectRoomArgs): Promise<{ game: Game }> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("reconnectRoom", reconnectRoomArgs, (response: CallbackResponseReconnectRoom) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({ game: response.game });
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, [isConnected]);

  /**
   * Sends an in-game message via the socket.
   * 
   * @param {InGameMessageArgs} inGameMessageArgs - The message details to be sent during the game.
   * @returns {Promise<boolean>} A promise that resolves to true if the message is sent successfully, false otherwise.
   */
  const sendInGameMessage = useCallback((inGameMessageArgs: InGameMessageArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("sendGameMessage", inGameMessageArgs, (response: CallbackResponse) => {
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

  /**
   * Sends a move during a game via the socket.
   * 
   * @param {MoveArgs} moveArgs - The move details to be sent during the game.
   * @returns {Promise<boolean>} A promise that resolves to true if the move is sent successfully, false otherwise.
   */
  const sendMove = useCallback((moveArgs: MoveArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("sendMove", moveArgs, (response: CallbackResponseMove) => {
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
  
  /**
   * Sends a forfeit signal during a game via the socket.
   * 
   * @param {ForfeitArgs} forfeitArgs - The forfeit details to be sent during the game.
   * @returns {Promise<boolean>} A promise that resolves to true if the forfeit signal is sent successfully, false otherwise.
   */
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

  /**
   * Sends a request to create a bot game via the socket connection.
   *
   * @param {CreateBotGameArgs} createBotGameArgs - The arguments required to create a bot game, such as player details and game settings.
   * @returns {Promise<{ botGame: BotGame } | null>} A promise that resolves with the created bot game details, or rejects with an error if the request fails.
   * @throws {Error} If the socket is not connected or the server returns an error during the bot game creation.
   */
  const sendCreateBotGame = useCallback((createBotGameArgs: CreateBotGameArgs): Promise<{ botGame: BotGame } | null> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("createBotGame", createBotGameArgs, (response: CallbackResponseCreateBotGame) => {
          if (response.error) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({ botGame: response.botGame });
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(new Error('Socket is not connected'));
      }
    });
  }, [isConnected]);


  /**
   * Sends a request to close a bot game via the socket connection.
   *
   * @param {CloseBotGameArgs} closeBotGameArgs - The arguments required to close a bot game, including the game ID and any additional details.
   * @returns {Promise<boolean>} A promise that resolves to `true` if the game was successfully closed, or rejects with `false` if an error occurs.
   * @throws {Error} If the socket is not connected or the server returns an error while closing the bot game.
   */
  const sendCloseBotGame = useCallback((closeBotGameArgs: CloseBotGameArgs): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("closeBotGame", closeBotGameArgs, (response: CallbackResponseCreateBotGame) => {
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
  
  /**
   * Sends a request to fetch the bot's move via the socket connection.
   *
   * @param {GetBotMoveArgs} getBotMoveArgs - The arguments required to determine the bot's next move, including the current game state.
   * @returns {Promise<{ botMove: Move }>} A promise that resolves with the bot's next move, or rejects with an error if the request fails.
   * @throws {Error} If the socket is not connected or the server returns an error during the move calculation.
   */
  const sendGetBotMove = useCallback((getBotMoveArgs: GetBotMoveArgs): Promise<{botMove: Move}> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("getBotMove", getBotMoveArgs, (response: CallbackResponseGetBotMove) => {
          if (response.error || !response.botMove) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({botMove: response.botMove});
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, [isConnected]);

  /**
   * Sends a request to fetch a move hint via the socket connection.
   *
   * @param {GetMoveHintArgs} getMoveHintArgs - The arguments required to generate a move hint, including the current game state.
   * @returns {Promise<{ move: Move }>} A promise that resolves with the suggested move as a hint, or rejects with an error if the request fails.
   * @throws {Error} If the socket is not connected or the server returns an error during hint generation.
   */
  const sendGetMoveHint = useCallback((getMoveHintArgs: GetMoveHintArgs): Promise<{move: Move}> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit("moveHint", getMoveHintArgs, (response: CallbackResponseGetMoveHint) => {
          if (response.error || !response.move) {
            setResponseMessage(response.message);
            reject(new Error(response.message));
          } else {
            setResponseMessage(response.message);
            resolve({move: response.move});
          }
        });
      } else {
        setErrorSocket('Socket is not connected');
        reject(false);
      }
    });
  }, [isConnected]);

  /**
   * Establishes a socket connection using the provided access token.
   * 
   * @param {string} accessToken - The access token used for authenticating the socket connection.
   */
  const connectSocket = useCallback((accessToken: string) => {
    if (socketRef.current || !playerStatic) return;

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
        if (!playerStatic) throw Error("Player required for adding username") 
        await sendAddUser({ username: playerStatic.username, userId: playerStatic.userId});
        setIsConnected(true);
        setErrorSocket(null);
      } catch (error) {
        setIsConnected(false);
        setErrorSocket("Add username error");
      }
    });

    socketInstance.on('disconnect', () => {
      console.error("Disconnected from socket");
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
  }, [url, playerStatic, sendAddUser]);

  /**
   * Disconnects the socket connection and clears the relevant states.
   */
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setErrorSocket(null);
    }
  }, []);

  /**
   * Listens for user navigation away and back to checkmate play, and attempts to reconnect socket if it has gone stale. 
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && currentUser && accessToken && playerStatic && !isConnected) {
        disconnectSocket();
        connectSocket(accessToken);
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
  
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [connectSocket, disconnectSocket, currentUser, playerStatic, accessToken, isConnected]);

  /**
   * Initializes and manages socket connections and disconnections based on user authentication and player data.
   */
  useEffect(() => {
    if (currentUser && accessToken && playerStatic) {
      disconnectSocket();
      connectSocket(accessToken);
    }

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, currentUser, playerStatic, accessToken]);

  return (
    <SocketContext.Provider value={{
      isConnected, errorSocket, refresh, errorReconnect, setErrorReconnect, setRefresh,
      sendAddUser, sendCreateRoom, sendJoinRoom, sendCloseRoom, sendInGameMessage, connectSocket, 
      disconnectSocket, sendMove, sendForfeit, responseMessage, socketRef, handleCallback, sendReconnectRoom, 
      sendGetBotMove, sendCreateBotGame, sendGetMoveHint, sendCloseBotGame
    }}>
      {children}
    </SocketContext.Provider>
  );
};

/**
 * Custom hook to access the SocketContext.
 * Throws an error if used outside of SocketProvider.
 * 
 * @returns {SocketContextType} The player context value.
 */
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};