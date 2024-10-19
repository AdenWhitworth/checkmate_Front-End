import { Message } from "../GameChatTypes";

/**
 * Props for the MessageEntry component.
 *
 * @interface MessageEntryProps
 * @property {string} textInput - The current value of the text input field.
 * @property {(value: string) => void} setTextInput - A function to update the value of the text input.
 * @property {(value?: Message) => void} handleSendMessage - A function to handle the sending of a message.
 * @property {(event: React.KeyboardEvent<HTMLInputElement>) => void} handleKeyPress - A function to handle key press events within the text input field.
 */
export interface MessageEntryProps {
    textInput: string;
    setTextInput: (value: string) => void;
    handleSendMessage: (value?: Message) => void;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}