import React, { useState, useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Badge from '@mui/material/Badge';
import message_regular from "../../../../Images/message-regular.svg";
import message_solid from "../../../../Images/message-solid.svg";
import paper_plane from "../../../../Images/Paper Plane.svg";
import MessageItem from "./MessageItem/MessageItem";
import { useGame } from "../../../../Providers/GameProvider/GameProvider";
import { useSocket } from "../../../../Providers/SocketProvider/SocketProvider";
import { usePlayer } from "../../../../Providers/PlayerProvider/PlayerProvider";
import { Message } from "./GameChatTypes";
import { InGameMessageArgs } from "../../../../Providers/SocketProvider/SocketProviderTypes";
import { handleCallback } from "../../../../Providers/SocketProvider/SocketProvider";
import './GameChat.css';

export default function GameChat() {
    const [textInput, setTextInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [lastMessage, setLastMessage] = useState<Message | null>(null);
    const [messageBadge, setMessageBadge] = useState(0);
    const [messageStyle, setMessageStyle] = useState(message_regular);
    const [incomingMessage, setIncomingMessage] = useState<Message | null>(null);
    const [messagesToggle, setMessagesToggle] = useState(false);
    const message_txt_container = useRef<HTMLUListElement>(null); 
  
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
          
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].status = "delivered";
            return updatedMessages;
          });
        } catch (error) {
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1].status = "error";
            return updatedMessages;
          });
          setLastMessage(newMessage);
        } finally {
          setTextInput('');
        }
      };
      

    const removeLastMessage = () => {
        setMessages((prevMessages) => prevMessages.length > 0 ? prevMessages.slice(0, prevMessages.length - 1) : prevMessages);
    };
  
    const retrySendMessage = () => {
      if (lastMessage) {
        removeLastMessage();
        handleSendMessage(lastMessage);
      }
    };
  
    const handleRecieveMessage = useCallback(() => {
      if (socketRef.current) {
        socketRef.current.off('receiveGameMessage');
        socketRef.current.on('receiveGameMessage', (inGameMessageArgs: InGameMessageArgs, callback: Function) => {
          try {

            inGameMessageArgs.inGameMessage.status = "recieved";

            setIncomingMessage(inGameMessageArgs.inGameMessage);
            handleCallback(callback, "Processed message");
          } catch (error) {
            handleCallback(callback, "Error processing message");
          }
        });
      }
    }, [socketRef]);
  
    const appendIncomingMessage = () => {
      if (!incomingMessage) return;
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
      setMessageBadge((prevBadge) => prevBadge + 1);
    };
  
    const scrollToBottom = () => {
      if (messagesToggle && message_txt_container.current) {
        message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;
      }
    };
  
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
  
    useEffect(() => {
      handleRecieveMessage();
    }, [handleRecieveMessage]);
  
    useEffect(() => {
      appendIncomingMessage();
    }, [incomingMessage]);
  
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  
    useEffect(() => {
      handleMessagesToggle();
    }, [messagesToggle]);
  
    return (
      <div className="message-container">
        {messagesToggle && (
          <div className="message-toggle">
            <ul className="message-txt-container" ref={message_txt_container}>
              {messages.map((message, index) => (
                <MessageItem 
                  key={message.id} 
                  message={message}
                  retrySendMessage={retrySendMessage}
                />
              ))}
            </ul>
  
            <div className="message-entry">
              <input
                value={textInput}
                onKeyDown={handleKeyPress}
                onChange={(e) => setTextInput(e.target.value)}
                type="text"
                placeholder="Text message..."
              />
              <img onClick={() => handleSendMessage()} src={paper_plane} alt="Send Message" />
            </div>
          </div>
        )}
  
        <div className="message-icon-container">
          <Badge onClick={showMessages} badgeContent={messageBadge} color="primary">
            <img className="message-icon" src={messageStyle} alt="Message Icon" />
          </Badge>
        </div>
      </div>
    );
}
  



/*
import message_regular from "../../../../Images/message-regular.svg";
import message_solid from "../../../../Images/message-solid.svg";
import paper_plane from "../../../../Images/Paper Plane.svg";
import MessageItem from "./MessageItem/MessageItem";
import React, {useState, useEffect, useRef, useCallback} from "react";
import {v4 as uuidv4} from "uuid";
import Badge from '@mui/material/Badge';
import { useGame } from "../../../../Providers/GameProvider/GameProvider";
import { useSocket } from "../../../../Providers/SocketProvider/SocketProvider";
import { usePlayer } from "../../../../Providers/PlayerProvider/PlayerProvider";
import { Message } from "./GameChatTypes";
import { InGameMessageArgs } from "../../../../Providers/SocketProvider/SocketProviderTypes";
import { handleCallback } from "../../../../Providers/SocketProvider/SocketProvider";

export default function MessageDialog() {

    const [textInput, setTextInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const message_txt_container = useRef(null);
    const [messagesToggle, setMessagesToggle] = useState(false); 
    const [messageError, setMessageError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState<Message | null>(null);
    const [messageBadge, setMessageBadge] = useState(0);
    const [messageStyle, setMessageStyle] = useState(message_regular);
    const [incommingMessage, setIncommingMessage] = useState<Message | null>(null);

    const { player } = usePlayer();
    const { socketRef, sendInGameMessage } = useSocket();
    const { room } = useGame();

    const handleSend = () => {

        if (!room || !player || messageError) return;

        setMessageError(null);

        var date = new Date();
        var minutes = date.getMinutes();
        var hours = date.getHours();
        let hour;

        //Convert to AM/PM hours
        if (hours > 12){
            hour = hours - 12;
        } else {
            hour = hours;
        }

        //establish AM or PM
        var ampm = (hours >= 12) ? "PM" : "AM";

        let time;

        if (hour < 10){
            if (minutes < 10){
                time = `0${hour}:0${minutes} ${ampm}`;
            } else {
                time = `0${hour}:${minutes} ${ampm}`;
            }
        } else {
            time = `${hour}:${minutes} ${ampm}`;
        }

        const messagesCopy: Message[] = [...messages];
        const formatMessage: Message = {
            id: uuidv4(),
            message: textInput,
            time: time,
            username: player.username,
            room: room,
            messageError: messageError,
        }

        messagesCopy.push(formatMessage);

        setMessages(messagesCopy);
        setNewMessage(newMessage);
    }

    const handleSendMessage = async () => {
        try {
            if(!newMessage) throw Error("Must have a new message.")
            await sendInGameMessage({inGameMessage: newMessage});
            
        } catch (error) {
            setMessageError("Error sending message.");
            const messagesCopy = [...messages];
            var lastMessage = messagesCopy.pop();
            lastMessage?.messageError = "Error sending message."
            messagesCopy.push(lastMessage);

            setMessages(messagesCopy);
        }
    }

    const handleRecieveMessage = useCallback(() => {
        if (socketRef.current) {
          socketRef.current.off('recieveGameMessage');
          socketRef.current.on('recieveGameMessage', (inGameMessageArgs: InGameMessageArgs, callback: Function) => {
            try {
                setIncommingMessage(inGameMessageArgs.inGameMessage);
                handleCallback(callback, "Processed message");
            } catch (error) {
              handleCallback(callback, "Error processing message");
            }
          });
        }
      }, [socketRef]);


    const appendOpponentMessage = () => {
        if(!incommingMessage) return;
        const messagesCopy = [...messages];
        messagesCopy.push(incommingMessage);
        setMessages(messagesCopy);

        setMessageBadge((previous) => previous + 1);
    }

    const bottomScrollMessages = () => {
        if (messagesToggle === true){
            message_txt_container.current.scrollTop = message_txt_container.current.scrollHeight;
        }
    }

    const handleFormattedMessage = () => {
        if (messagesToggle === true && !messages && !newMessage){
            setTextInput('');
            handleSendMessage();
        }
    }

    const handleType = (event) => {
        setTextInput(event.target.value);
    }

    const handleKeyPress = (event) => {
        if (event.keyCode === 13 || event.which === 13) {
            handleSend();
        }
    }

    const showMessages = () => {
        setMessageBadge(0);
        setMessagesToggle(!messagesToggle);
    }

    const retrySendMessage = () => {
        handleSendMessage();
    }

    const handleMessagesToggle = () => {
        if(messagesToggle === true){
            setMessageStyle(message_solid);
            bottomScrollMessages();
        } else {
            setMessageStyle(message_regular);
        }
    }

    useEffect(() => {
        handleRecieveMessage();
    }, [handleRecieveMessage]);

    useEffect(() => {
        appendOpponentMessage();
    },[incommingMessage]);

    useEffect(() => {
        bottomScrollMessages();
    },[messages])
    
    useEffect(() => {
        handleFormattedMessage();
    }, [newMessage])

    useEffect(() => {
        handleMessagesToggle();
    },[messagesToggle])

    return (

        <div className="message-container">
            {messagesToggle? 
            <div className="message-toggle">
                <ul className="message-txt-container" ref={message_txt_container}>
                    
                    {messages.map((message) => <MessageItem key={message.id} message={message} retrySendMessage={retrySendMessage}/>)}
                    
                </ul>

                <div className="message-entry">
                        <input value={textInput} onKeyDown={handleKeyPress} onChange={handleType} type="text" placeholder="Text message..."></input>
                        <img onClick={handleSend} src={paper_plane}></img>
                </div>
            </div>
            :<></>}

            <div className="message-icon-container">
                <Badge onClick={showMessages} badgeContent={messageBadge} color="primary"><img class="message-icon" src={messageStyle}></img></Badge>
            </div>  
        </div>

             
    );
}
*/