import { Room } from "../../../../Providers/GameProvider/GameProviderTypes";

export interface Message {
    id: string;
    message: string;
    time: string;
    username: string;
    room: Room;
    status: "sending" | "delivered" | "error" | "received";
}