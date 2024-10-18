import { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message } from "../../components/Dashboard/GameChat/GameChatTypes";
import { useGame } from "../../Providers/GameProvider/GameProvider";
import { useSocket } from "../../Providers/SocketProvider/SocketProvider";
import { usePlayer } from "../../Providers/PlayerProvider/PlayerProvider";
import { InGameMessageArgs } from "../../Providers/SocketProvider/SocketProviderTypes";
import { handleCallback } from "../../Providers/SocketProvider/SocketProvider";
import message_regular from "../../Images/message-regular.svg";
import message_solid from "../../Images/message-solid.svg";

export const useMessageHandler = () => {
    const [textInput, setTextInput] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [lastMessage, setLastMessage] = useState<Message | null>(null);
    const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);
    const message_txt_container = useRef<HTMLUListElement>(null); 
    const [messageBadge, setMessageBadge] = useState(0);
    const [messageStyle, setMessageStyle] = useState(message_regular);
    const [messagesToggle, setMessagesToggle] = useState(false);

    const { player } = usePlayer();
    const { room } = useGame();
    const { socketRef, sendInGameMessage } = useSocket();

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHour = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHour}:${formattedMinutes} ${ampm}`;
    };

    const handleSendMessage = async (retryMessage?: Message) => {
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
    };

    const updateMessageStatus = (status: "delivered" | "error") => {
        setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].status = status;
            return updatedMessages;
        });
    };

    const removeLastMessage = () => {
        setMessages((prevMessages) => prevMessages.length > 0 ? prevMessages.slice(0, prevMessages.length - 1) : prevMessages);
    };
  
    const retrySendMessage = () => {
        if (lastMessage) {
            const retryMessage = {
                ...lastMessage,
                id: uuidv4(),
            };
            removeLastMessage();
            handleSendMessage(retryMessage);
        }
    };
  
    const handleReceiveMessage = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.off('receiveGameMessage');
            socketRef.current.on('receiveGameMessage', (inGameMessageArgs: InGameMessageArgs, callback: Function) => {
                try {
                    const incomingMessage = inGameMessageArgs.inGameMessage;
                    incomingMessage.status = "received";
                    setIncomingMessage(inGameMessageArgs.inGameMessage);
                    handleCallback(callback, "Processed message");
                } catch (error) {
                    handleCallback(callback, "Error processing message");
                }
            });
        }
    }, [socketRef]);

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const showMessages = () => {
        setMessageBadge(0);
        setMessagesToggle(!messagesToggle);
    };

    const handleMessagesToggle = () => {
        if (messagesToggle) {
            setMessageStyle(message_solid);
            scrollToBottom();
        } else {
            setMessageStyle(message_regular);
        }
    };

    const scrollToBottom = () => {
        if (messagesToggle && message_txt_container.current) {
            message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;
        }
    };

    const appendIncomingMessage = () => {
        if (!incomingMessage) return;
        setMessages((prevMessages) => [...prevMessages, incomingMessage]);
        setMessageBadge((prevBadge) => prevBadge + 1);
    };

    useEffect(() => {
        handleReceiveMessage();
    }, [handleReceiveMessage]);

    useEffect(() => {
        appendIncomingMessage();
    }, [incomingMessage]);

    useEffect(() => {
        handleMessagesToggle();
    }, [messagesToggle]);

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
