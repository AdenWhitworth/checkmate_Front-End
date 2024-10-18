import { MessageItemProps } from "./MessageItemTypes";
import { usePlayer } from "../../../../../Providers/PlayerProvider/PlayerProvider";
import './MessageItem.css';

export default function MessageItem({
    message,
    retrySendMessage
}: MessageItemProps) {

    const { player } = usePlayer();

    const messageStyle = message.username === player?.username ? "message-txt message-player" : "message-txt message-opponent";
    const fromStyle = message.username === player?.username ? "txt-player" : "txt-opponent";

    return (
        <li>
            <div className="message-full">
                <div className={messageStyle}>
                    <h4>{message.message}</h4>
                </div>
                <h5 className={fromStyle}>{message.username} - {message.time}</h5>
                {message.status === "sending" && <h5 className="message-status txt-player">Sending...</h5>}
                {message.status === "delivered" && <h5 className="message-status txt-player">Delivered</h5>}
                {message.status === "error" && <h5 className="message-error txt-player">Error! <button onClick={retrySendMessage}>Resend</button></h5>}
            </div>
        </li>
    );
}
