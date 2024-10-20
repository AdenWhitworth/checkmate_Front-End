import { Message } from "../../components/Dashboard/GameChat/GameChatTypes";

/**
 * Interface representing the output of the useMessageHandler hook.
 *
 * @interface UseMessageHandlerOutput
 * @property {Message[]} messages - An array of message objects containing information like message content, sender, and timestamp.
 * @property {string} textInput - The current text input value in the message field.
 * @property {function} setTextInput - Function to set the value of the text input field.
 * @param {string} value - The new value to set for the text input field.
 * @property {function} handleSendMessage - Function to send a message. If a retry message is provided, it sends that message instead.
 * @param {Message} [retryMessage] - (Optional) A message object that needs to be resent.
 * @property {function} retrySendMessage - Function to retry sending the last failed message.
 * @property {React.RefObject<HTMLUListElement>} message_txt_container - A ref object pointing to the HTML element containing the message list.
 * @property {number} messageBadge - The count of unread messages displayed as a badge.
 * @property {function} handleKeyPress - Function to handle key press events in the text input field.
 * @param {React.KeyboardEvent<HTMLInputElement>} event - The keyboard event that triggered the function.
 * @property {function} showMessages - Function to toggle the visibility of the message container and reset the unread message badge.
 * @property {boolean} messagesToggle - Boolean indicating whether the message container is currently visible or hidden.
 * @property {string} messageStyle - The style class to apply to the message icon (e.g., for indicating new messages).
 */
export interface UseMessageHandlerOutput {
    messages: Message[];
    textInput: string;
    setTextInput: (value: string) => void;
    handleSendMessage: (retryMessage?: Message) => void;
    retrySendMessage: () => void;
    message_txt_container: React.RefObject<HTMLUListElement>;
    messageBadge: number;
    handleKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    showMessages: () => void;
    messagesToggle: boolean;
    messageStyle: string;
}