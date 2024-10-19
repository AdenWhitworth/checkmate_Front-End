import { Message } from "../GameChatTypes";

/**
 * Props for the MessageItem component.
 *
 * @interface MessageItemProps
 * @property {Message} message - The message object containing details such as id, message content, sender, and status.
 * @property {Function} retrySendMessage - Function that handles retrying a message send operation in case of an error.
 */
export interface MessageItemProps {
    message: Message;
    retrySendMessage: () => void;
}