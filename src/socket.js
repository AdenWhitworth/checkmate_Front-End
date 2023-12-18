import { io } from "socket.io-client"; // import connection function

//const socket = io('localhost:8080'); // initialize websocket connection
const socket = io('https://online-chess-with-friends-server.glitch.me');

export default socket;