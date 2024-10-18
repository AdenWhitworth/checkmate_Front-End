import { Message } from "../GameChatTypes";

export interface MessageEntryProps {
    textInput: string;
    setTextInput: (value: string) => void;
    handleSendMessage: (value?: Message) => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}