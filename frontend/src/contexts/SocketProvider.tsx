import { io, Socket } from "socket.io-client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { AuthContext } from "./AuthProvider";

export const SocketContext = createContext<Socket | null>(null);

interface socketProviderProps {
    children: ReactNode;
}

export function SocketProvider(props: socketProviderProps): JSX.Element {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { validToken, userId } = useContext(AuthContext);

    useEffect(() => {
        if (validToken) {
            console.log("Initializing socket for userId:", userId);
            const newSocket = io(backendUrl.base, {
                query: {
                    message: JSON.stringify({ userID: userId }),
                },
            });
            setSocket(newSocket);
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }

        return () => {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        };
    }, [validToken, userId]);

    return (
        <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
    );
}
