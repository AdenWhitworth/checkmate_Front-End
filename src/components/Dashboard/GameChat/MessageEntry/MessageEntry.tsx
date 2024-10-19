import React from "react";
import paper_plane from "../../../../Images/Paper Plane.svg";
import { MessageEntryProps } from "./MessageEntryTypes";
import "./MessageEntry.css";

/**
 * A component that renders the message entry area with an input field 
 * and a send button (image).
 *
 * @component
 * @param {MessageEntryProps} props - The props for the MessageEntry component.
 * @param {string} props.textInput - The current value of the message input field.
 * @param {function} props.setTextInput - Function to update the message input field value.
 * @param {function} props.handleSendMessage - Function to handle sending the message.
 * @param {function} props.handleKeyPress - Function to handle key press events within the input field.
 * @returns {JSX.Element} A message entry form with an input field and a send button.
 */
export const MessageEntry = ({ 
    textInput, 
    setTextInput, 
    handleSendMessage, 
    handleKeyPress 
}: MessageEntryProps): JSX.Element => {
    return (
        <div className="message-entry">
            <input
                value={textInput}
                onKeyDown={handleKeyPress}
                onChange={(e) => setTextInput(e.target.value)}
                type="text"
                placeholder="Message..."
            />
            <img onClick={() => handleSendMessage} src={paper_plane} alt="Send Message" />
        </div>
    );
};
