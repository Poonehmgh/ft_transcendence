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
    const { validToken, userId } = useContext(AuthContext);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [updateTrigger, setUpdateTrigger] = useState(false);

    // update activechat if updatemessage.id === activechat.id

    useEffect(() => {
        if (!socket) return;

        const handleNewChatMessage = (message: any) => {
            alert(`New chat message: ${message.content}`);
            setUpdateTrigger((prev) => !prev);
            //better: add the message to the messages
        };
        socket.on("updateMessage", handleNewChatMessage);

        return () => {
            socket.off("updateMessage", handleNewChatMessage);
        };
    }, [socket]);



    useEffect(() => {
        function disconnectSocket(socket: Socket | null, userId: number) {
            if (socket) {
                console.log("Disconnecting socket for userId:", userId);
                socket.disconnect();
                setSocket(null);
            }
        }

        if (validToken) {
            console.log("Connecting socket for userId:", userId);
            const newSocket = io(backendUrl.base, {
                query: {
                    userId: userId,
                }
            });
           // newSocket.emit("connectMessage", { userID: userId });
            
            // shouldn't ever not be null, but nice syntax example for
            // react's functional update pattern
            setSocket((prevSocket) => {
                if (prevSocket) {
                    prevSocket.disconnect();
                }
                return newSocket;
            });
        } else {
            disconnectSocket(socket, userId);
        }

        return () => {
            disconnectSocket(socket, userId);
        };
        // eslint wants socket in the dependency array, but it would trigger an infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validToken, userId]);

    return (
        <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
    );
}
