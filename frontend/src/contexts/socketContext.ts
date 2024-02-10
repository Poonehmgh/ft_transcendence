import { io } from "socket.io-client";
import { createContext } from "react";
import backendUrl from "src/constants/backendUrl";

export const socket = io(backendUrl.base);

export const SocketContext = createContext(socket);
