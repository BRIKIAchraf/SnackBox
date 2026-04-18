import { io } from "socket.io-client";

const SOCKET_URL = "https://api-production-48c5.up.railway.app";

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    upgrade: false,
    autoConnect: true,
});
