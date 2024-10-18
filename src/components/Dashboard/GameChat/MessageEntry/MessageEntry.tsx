import React from "react";
import paper_plane from "../../../../Images/Paper Plane.svg";
import { MessageEntryProps } from "./MessageEntryTypes";

export const MessageEntry = ({ 
    textInput, 
    setTextInput, 
    handleSendMessage, 
    handleKeyPress 
}: MessageEntryProps) => {
    return (
        <div className="message-entry">
        <input
            value={textInput}
            onKeyDown={handleKeyPress}
            onChange={(e) => setTextInput(e.target.value)}
            type="text"
            placeholder="Message..."
        />
        <img onClick={() => handleSendMessage()} src={paper_plane} alt="Send Message" />
        </div>
    );
};
