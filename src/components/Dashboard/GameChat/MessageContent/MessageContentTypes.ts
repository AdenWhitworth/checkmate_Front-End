import { Message } from "../GameChatTypes";
import { RefObject } from "react";

/**
 * Properties for the MessageContent component.
 * @interface MessageContentProps
 * @property {Message[]} messages - An array of message objects representing the chat messages.
 * @property {() => void} retrySendMessage - A callback function for retrying to send a message that failed.
 * @property {RefObject<HTMLUListElement>} message_txt_container - A React ref object pointing to the container for the message list.
 */
export interface MessageContentProps {
  messages: Message[];
  retrySendMessage: () => void;
  message_txt_container: RefObject<HTMLUListElement>;
}