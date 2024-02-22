import { io, Socket } from "socket.io-client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { AuthContext } from "./AuthProvider";
import { SocialDataContext } from "./SocialDataProvider";
import { GameInviteAction, GameInviteDTO } from "src/dto/chat-dto";

export const SocketContext = createContext<Socket | null>(null);

function handleMatchInvite(data: GameInviteDTO, socket: Socket) {
    console.log("handleMatchInvite:", data);
    if (!socket) {
        console.log("Error in handleMatchInvite: socket is null");
        return;
    }
    if (window.confirm(`${data.inviterName} has challenged you! Do you accept?`)) {
        data.action = GameInviteAction.acceptInvite;
    } else {
        data.action = GameInviteAction.declineInvite;
    }

    socket.emit("matchInvite", data);
}

interface socketProviderProps {
    children: ReactNode;
}

export function SocketProvider(props: socketProviderProps): JSX.Element {
    const { validToken, userId } = useContext(AuthContext);
    const { updateUserData } = useContext(SocialDataContext);
    const [socket, setSocket] = useState<Socket | null>(null);

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
            newSocket.on("matchInvite", (data: GameInviteDTO) =>
                handleMatchInvite(data, newSocket)
            );
            newSocket.on("errorAlert", (data) => alert(data.message));
            newSocket.onAny((event, ...args) => {
                console.log("socket event:", event, args);
            });

            setSocket(newSocket);

            return () => {
                newSocket.off("errorAlert");
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
