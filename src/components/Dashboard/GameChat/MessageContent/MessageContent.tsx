import React from "react";
import MessageItem from "../MessageItem/MessageItem";
import { MessageContentProps } from "./MessageContentTypes";

export const MessageContent = ({ 
        messages, 
        retrySendMessage, 
        message_txt_container
}: MessageContentProps) => {
    return (
        <ul className="message-txt-container" ref={message_txt_container}>
            {messages.map((message) => (
                <MessageItem key={message.id} message={message} retrySendMessage={retrySendMessage} />
            ))}
        </ul>
    );
};
