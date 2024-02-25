import { io, Socket } from "socket.io-client";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { useNavigate } from "react-router-dom";

// Contexts
import { AuthContext } from "./AuthProvider";
import { SocialDataContext } from "./SocialDataProvider";
import { ToastContext } from "src/contexts/ToastProvider";

// DTO
import { GameInviteAction, GameInviteDTO } from "src/dto/chat-dto";

export const SocketContext = createContext<Socket | null>(null);

interface socketProviderProps {
    children: ReactNode;
}

export function SocketProvider(props: socketProviderProps): JSX.Element {
    const { validToken, userId } = useContext(AuthContext);
    const { updateUserData } = useContext(SocialDataContext);
    const { showToast } = useContext(ToastContext);
    const [socket, setSocket] = useState<Socket | null>(null);
    const navigate = useNavigate();

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

        function initSocket() {
            if (validToken && !socket) {
                const newSocket = connectSocket();

                newSocket.on("socialUpdate", updateUserData);
                newSocket.on("matchInvite", (data: GameInviteDTO) =>
                    handleMatchInvite(data, newSocket)
                );
                newSocket.on("errorAlert", (data) => showToast(data.message));
                newSocket.onAny((event, ...args) => {
                    console.log("socket event:", event, args);
                });

                setSocket(newSocket);

                return () => {
                    newSocket.off("socialUpdate");
                    newSocket.off("matchInvite");
                    newSocket.off("errorAlert");
                    newSocket.offAny();
                    disconnectSocket(newSocket);
                };
            } else if (!validToken && socket) {
                disconnectSocket(socket);
                setSocket(null);
            }
        }

        // wanted to have only one socket event for this.
        // probably would be nicer to have a separate event for each action
        function handleMatchInvite(data: GameInviteDTO, socket: Socket) {
            console.log("handleMatchInvite:", data);
            if (!socket) {
                console.log("Error in handleMatchInvite: socket is null");
                return;
            }
            switch (data.action) {
                case GameInviteAction.invite:
                    if (
                        window.confirm(
                            `${data.inviterName} has challenged you! Do you accept?`
                        )
                    ) {
                        data.action = GameInviteAction.acceptInvite;
                    } else {
                        data.action = GameInviteAction.declineInvite;
                    }
                    socket.emit("matchInvite", data);
                    break;
                case GameInviteAction.declineInvite:
                    showToast(`${data.inviteeName} has declined your challenge.`);
                    break;
                case GameInviteAction.matchBegin:
                    if (data.inviterId === userId) {
                        showToast(`${data.inviteeName} has accepted your challenge!`);
                    } else {
                        showToast(`You have accepted ${data.inviterName}'s challenge!`);
                    }
                    navigate("/game");
                    break;
                default:
                    console.error("Invalid GameInviteAction:", data.action);
            }
        }

        initSocket();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [validToken, userId]);

    return (
        <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
    );
}
