import { MessageItemProps } from "./MessageItemTypes";
import { usePlayer } from "../../../../Providers/PlayerProvider/PlayerProvider";
import './MessageItem.css';

export default function MessageItem({
    message,
    retrySendMessage
}: MessageItemProps) {

    const { player } = usePlayer();

    const isPlayer = message.username === player?.username;
    const messageClass = isPlayer ? "message-txt message-player" : "message-txt message-opponent";
    const fromClass = isPlayer ? "txt-player" : "txt-opponent";

    const renderStatus = () => {
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

