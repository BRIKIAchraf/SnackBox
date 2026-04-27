import { io } from "socket.io-client";

import { SOCKET_URL } from "./api-config";

export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    upgrade: false,
    autoConnect: true,
});
