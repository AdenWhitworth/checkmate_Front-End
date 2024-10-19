import React from "react";
import MessageItem from "../MessageItem/MessageItem";
import { MessageContentProps } from "./MessageContentTypes";
import './MessageContent.css';


/**
 * Renders the list of messages in a chat interface.
 * @param {Object} props - Component props.
 * @param {Array} props.messages - The list of message objects to render.
 * @param {Function} props.retrySendMessage - Callback function for retrying a failed message.
 * @param {React.RefObject<HTMLUListElement>} props.message_txt_container - Ref object for the container element.
 * @returns {JSX.Element} The rendered list of messages.
 */
export const MessageContent = ({ 
        messages, 
        retrySendMessage, 
        message_txt_container
}: MessageContentProps): JSX.Element => {
    return (
        <ul 
            className="message-txt-container" 
            ref={message_txt_container}
        >
            {messages.map((message) => (
                <MessageItem 
                    key={message.id} 
                    message={message} 
                    retrySendMessage={retrySendMessage} 
                />
            ))}
        </ul>
    );
};
