import { io, Socket } from "socket.io-client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { AuthContext } from "./AuthProvider";
import { SocialDataContext } from "./SocialDataProvider";

export const SocketContext = createContext<Socket | null>(null);

interface socketProviderProps {
    children: ReactNode;
}

export function SocketProvider(props: socketProviderProps): JSX.Element {
    const { validToken, userId } = useContext(AuthContext);
    const { updateUserData } = useContext(SocialDataContext);
    const [socket, setSocket] = useState<Socket | null>(null);

	function  handleGameInvite(data:any) {
		console.log("handleGameinvite:" ,data);
		if (prompt(data.message)) {
			socket.emit("gameInvite_accept",data );
		} else {
			socket.emit("gameInvite_decline")
		}
	}


    useEffect(() => {
        function connectSocket() {
            console.log("Connecting socket for userId:", userId);
            const newSocket = io(backendUrl.base, {
                query: {
                    userId: userId,
                },
            });
            setSocket(newSocket);
            return newSocket;
        }

        function disconnectSocket(socket: Socket) {
            console.log("Disconnecting socket for userId:", userId);
            socket.disconnect();
        }

        if (validToken && !socket) {
            const newSocket = connectSocket();
            newSocket.on("socialUpdate", updateUserData);
            newSocket.on("gameInvite", handleGameInvite);
            newSocket.onAny((event, ...args) => {
                console.log("socket event:", event, args);
            });

            return () => {
                newSocket.off("socialUpdate", updateUserData);
                newSocket.off("gameInvite", updateUserData);
                newSocket.offAny();
                disconnectSocket(newSocket);
            };
        } else if (!validToken && socket) {
            disconnectSocket(socket);
            setSocket(null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validToken, userId]);

    return (
        <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
    );
}
