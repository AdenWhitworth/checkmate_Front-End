import { Message } from "../GameChatTypes";

export interface MessageItemProps {
    message: Message;
    retrySendMessage: () => void;
}