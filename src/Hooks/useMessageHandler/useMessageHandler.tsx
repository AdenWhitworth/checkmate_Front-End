import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../../components/Dashboard/GameChat/GameChatTypes";
import { useGame } from "../../Providers/GameProvider/GameProvider";
import { useSocket } from "../../Providers/SocketProvider/SocketProvider";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { InGameMessageArgs } from "../../Providers/SocketProvider/SocketProviderTypes";
import message_regular from "../../Images/message-regular.svg";
import message_solid from "../../Images/message-solid.svg";
import { UseMessageHandlerOutput } from "./useMessageHandlerTypes";

/**
 * Custom hook to handle messaging functionality in an in-game chat.
 *
 * @returns {UseMessageHandlerOutput} The returned functions and properties from the useMessageHandler hook.
 */
export const useMessageHandler = (): UseMessageHandlerOutput => {
    const [textInput, setTextInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [lastMessage, setLastMessage] = useState<Message | null>(null);
    const message_txt_container = useRef<HTMLUListElement>(null); 
    const [messageBadge, setMessageBadge] = useState<number>(0);
    const [messageStyle, setMessageStyle] = useState<string>(message_regular);
    const [messagesToggle, setMessagesToggle] = useState<boolean>(false);

    const { player } = usePlayer();
    const { room } = useGame();
    const { socketRef, sendInGameMessage, handleCallback } = useSocket();

    /**
     * Formats a JavaScript Date object into a 12-hour format with AM/PM.
     * @param {Date} date - The date object to format.
     * @returns {string} The formatted time string.
     */
    const formatTime = useCallback((date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHour}:${formattedMinutes} ${ampm}`;
    }, []);

    /**
     * Updates the status of the last sent message.
     * @param {"delivered" | "error"} status - The new status of the message.
     */
    const updateMessageStatus = useCallback((status: "delivered" | "error") => {
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].status = status;
            return updatedMessages;
        });
    }, []);

    /**
     * Sends a message to the game room.
     * @param {Message} [retryMessage] - The message to retry if the initial attempt failed.
     */
    const handleSendMessage = useCallback(async (retryMessage?: Message) => {
        if ((!textInput && !retryMessage) || !room || !player) return;
      
        const newMessage: Message = retryMessage || {
            id: uuidv4(),
            message: textInput,
            time: formatTime(new Date()),
            username: player.username,
            room: room,
            status: "sending",
        };
      
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      
        try {
            await sendInGameMessage({ inGameMessage: newMessage });
            updateMessageStatus("delivered");
        } catch (error) {
            updateMessageStatus("error");
            setLastMessage(newMessage);
        } finally {
            setTextInput('');
        }
    }, [textInput, room, player, sendInGameMessage, formatTime, updateMessageStatus]);

    /**
     * Removes the last message from the messages state.
     */
    const removeLastMessage = useCallback(() => {
        setMessages((prevMessages) => prevMessages.length > 0 ? prevMessages.slice(0, prevMessages.length - 1) : prevMessages);
    }, []);
    
    /**
     * Retries sending the last failed message.
     */
    const retrySendMessage = useCallback(() => {
        if (lastMessage) {
            const retryMessage = {
                ...lastMessage,
                id: uuidv4(),
            };
            removeLastMessage();
            handleSendMessage(retryMessage);
        }
    }, [lastMessage, removeLastMessage, handleSendMessage]);
    
    /**
     * Handles receiving a message from the socket connection.
     */
    const handleReceiveMessage = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.off('receiveGameMessage');
            socketRef.current.on('receiveGameMessage', (inGameMessageArgs: InGameMessageArgs, callback: Function) => {
                try {
                    const incomingMessage = inGameMessageArgs.inGameMessage;
                    incomingMessage.status = "received";
                    setMessages((prevMessages) => [...prevMessages, incomingMessage]);
                    setMessageBadge((prevBadge) => prevBadge + 1);
                    handleCallback(callback, "Processed message");
                } catch (error) {
                    handleCallback(callback, "Error processing message");
                }
            });
        }
    }, [socketRef, handleCallback]);

    /**
     * Handles the "Enter" key press to send a message.
     * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event.
     */
    const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    }, [handleSendMessage]);

    /**
     * Toggles the visibility of the messages container and resets the badge count.
     */
    const showMessages = useCallback(() => {
        setMessageBadge(0);
        setMessagesToggle((prev) => !prev);
    }, []);

    /**
     * Scrolls to the bottom of the messages container.
     */
    const scrollToBottom = useCallback(() => {
        if (messagesToggle && message_txt_container.current) {
            message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;
        }
    }, [messagesToggle]);

    /**
     * Updates the message style based on the messages toggle state.
     */
    const handleMessagesToggle = useCallback(() => {
        if (messagesToggle) {
            setMessageStyle(message_solid);
            scrollToBottom();
        } else {
            setMessageStyle(message_regular);
        }
    }, [messagesToggle, scrollToBottom]);

    /**
     * Effect to handle incomming messages
     */
    useEffect(() => {
        handleReceiveMessage();
    }, [handleReceiveMessage]);

    /**
     * Effect to toggle between showing and hidding the ingame message field
     */
    useEffect(() => {
        handleMessagesToggle();
    }, [messagesToggle, handleMessagesToggle]);

    return {
        messages,
        textInput,
        setTextInput,
        handleSendMessage,
        retrySendMessage,
        message_txt_container,
        messageBadge,
        handleKeyPress,
        showMessages,
        messagesToggle,
        messageStyle
    };
};
