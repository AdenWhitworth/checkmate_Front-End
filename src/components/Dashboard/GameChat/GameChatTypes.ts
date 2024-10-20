import { Room } from "../../../Providers/GameProvider/GameProviderTypes";

/**
 * Represents a chat message in the game chat system.
 * 
 * @interface Message
 * @property {string} id - Unique identifier for the message.
 * @property {string} message - The content of the chat message.
 * @property {string} time - The time when the message was sent, formatted as a string.
 * @property {string} username - The username of the sender of the message.
 * @property {Room} room - The room to which this message belongs.
 * @property {"sending" | "delivered" | "error" | "received"} status - The current status of the message.
 */
export interface Message {
    id: string;
    message: string;
    time: string;
    username: string;
    room: Room;
    status: "sending" | "delivered" | "error" | "received";
}