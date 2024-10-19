import React from "react";
import { useMessageHandler } from "../../../Hooks/useMessageHandler/useMessageHandler";
import { MessageContent } from "./MessageContent/MessageContent";
import { MessageEntry } from "./MessageEntry/MessageEntry";
import { MessageIcon } from "./MessageIcon/MessageIcon";
import './GameChat.css';

/**
 * GameChat component handles the chat feature within a game. It displays messages, provides an input to send new messages, 
 * and shows a badge with the number of unread messages. It utilizes the `useMessageHandler` hook to manage message state and events.
 * 
 * @component
 * @returns {JSX.Element} The rendered GameChat component.
 */
export default function GameChat(): JSX.Element {
    const { 
        messages, 
        textInput, 
        setTextInput, 
        handleSendMessage, 
        retrySendMessage, 
        message_txt_container,
        messageBadge,
        handleKeyPress,
        messagesToggle,
        messageStyle,
        showMessages
    } = useMessageHandler();

    return (
        <div className="message-container">
            {messagesToggle && (
                <div className="message-toggle">
                    <MessageContent 
                        messages={messages} 
                        retrySendMessage={retrySendMessage} 
                        message_txt_container={message_txt_container} 
                    />
                    <MessageEntry 
                        textInput={textInput} 
                        setTextInput={setTextInput} 
                        handleSendMessage={handleSendMessage} 
                        handleKeyPress={handleKeyPress}
                    />
                </div>
            )}
            
            <MessageIcon messageBadge={messageBadge} messageStyle={messageStyle} showMessages={showMessages} />
        </div>
    );
}