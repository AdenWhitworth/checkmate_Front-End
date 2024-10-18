import { Message } from "../GameChatTypes";
import { RefObject } from "react";

export interface MessageContentProps {
  messages: Message[];
  retrySendMessage: () => void;
  message_txt_container: RefObject<HTMLUListElement>;
}