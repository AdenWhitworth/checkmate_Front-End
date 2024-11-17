import { MessageItemProps } from "./MessageItemTypes";
import { usePlayer } from "../../../../Providers/PlayerProvider/PlayerProvider";
import './MessageItem.css';

/**
 * MessageItem component displays an individual chat message.
 * It handles the message content, sender information, and message status such as sending, delivered, or error.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.message - The message object containing details about the message.
 * @param {string} props.message.id - Unique identifier for the message.
 * @param {string} props.message.message - The content of the message.
 * @param {string} props.message.time - The timestamp of when the message was sent.
 * @param {string} props.message.username - The username of the message sender.
 * @param {string} props.message.status - The current status of the message (sending, delivered, or error).
 * @param {Function} props.retrySendMessage - Function to retry sending the message in case of an error.
 * 
 * @returns {JSX.Element} The rendered MessageItem component.
 */
export default function MessageItem({
    message,
    retrySendMessage
}: MessageItemProps): JSX.Element {

    const { playerStatic } = usePlayer();

    const isPlayer = message.username === playerStatic?.username;
    const messageClass = isPlayer ? "message-txt message-player" : "message-txt message-opponent";
    const fromClass = isPlayer ? "txt-player" : "txt-opponent";

    /**
     * Renders the message status based on its current state.
     * 
     * @returns {JSX.Element | null} JSX element displaying the status or null if the status is undefined.
     */
    const renderStatus = (): JSX.Element | null => {
        switch (message.status) {
            case "sending":
                return <h5 className="message-status txt-player">Sending...</h5>;
            case "delivered":
                return <h5 className="message-status txt-player">Delivered</h5>;
            case "error":
                return <h5 className="message-error txt-player">Error! <button onClick={retrySendMessage}>Resend</button></h5>;
            default:
                return null;
        }
    };

    return (
        <li>
            <div className="message-full">
                <div className={messageClass}>
                    <h4>{message.message}</h4>
                </div>
                <h5 className={fromClass}>{message.username} - {message.time}</h5>
                {renderStatus()}
            </div>
        </li>
    );
}

