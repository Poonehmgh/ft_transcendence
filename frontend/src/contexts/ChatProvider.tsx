import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchX } from "src/functions/utils";

// Contexts
import { SocketContext } from "./SocketProvider";

// DTO
import {
    BasicChatWithUsersDTO,
    ChatDTO,
    ExtendedChatUserDTO,
    MessageDTO,
} from "chat-dto";

export const ChatContext = createContext({
    activeChat: null,
    changeActiveChat: (chatId: number) => {},
    selectedUser: null,
    changeSelectedUser: (userId: number) => {},
    thisUsersChats: null,
});

export function ChatProvider({ children }) {
    const socket = useContext(SocketContext);
    const [activeChat, setActiveChat] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [thisUsersChats, setThisUsersChats] = useState(null);

    const [updateTrigger, setUpdateTrigger] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const handleNewChatMessage = async (message: MessageDTO) => {
            console.log("New message received:", message);
            if (message.chatId === activeChat.id) {
                console.log("Updating activeChat with new message:", message);
                try {
                    await changeActiveChat(message.chatId);
                } catch (error) {
                    console.error("Error fetching updated chat:", error);
                }

                /* console.log("Updating activeChat with new message:", message);
                setActiveChat((prevActiveChat) => ({
                    ...prevActiveChat,
                    chatMessages: [...prevActiveChat.chatMessages, message],
                })); */
            }
        };

        socket.on("updateMessage", handleNewChatMessage);

        return () => {
            socket.off("updateMessage", handleNewChatMessage);
        };
    }, [socket, activeChat]);

    useEffect(() => {
        async function fetchThisUsersChats() {
            try {
                const apiUrl = backendUrl.chat + "my_chats";
                const thisUsersChats = await fetchX<BasicChatWithUsersDTO[]>(
                    "GET",
                    apiUrl,
                    null
                );
                setThisUsersChats(thisUsersChats);
            } catch (error) {
                console.error("Error fetching this user's chats:", error);
            }
        }

        fetchThisUsersChats();
    }, []);

    async function changeActiveChat(chatId: number) {
        try {
            const apiUrl = backendUrl.chat + `complete_chat/${chatId}`;
            const newActiveChat = await fetchX<ChatDTO>("GET", apiUrl, null);
            setActiveChat(newActiveChat);
        } catch (error) {
            console.error("Error changing active chat:", error);
        }
    }

    function changeSelectedUser(userId: number) {
        const selectedUser = activeChat.chatUsers.find(
            (e: ExtendedChatUserDTO) => e.userId === userId
        );
        setSelectedUser(selectedUser);
    }

    const contextValue = useMemo(
        () => ({
            activeChat,
            changeActiveChat,
            selectedUser,
            changeSelectedUser,
            thisUsersChats,
        }),
        [activeChat, changeActiveChat, selectedUser, changeSelectedUser, thisUsersChats]
    );

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
