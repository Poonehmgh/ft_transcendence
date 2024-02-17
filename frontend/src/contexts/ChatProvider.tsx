import React, { createContext, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchX } from "src/functions/utils";

// Contexts
import { SocketContext } from "./SocketProvider";

// DTO
import {
    BasicChatWithUsersDTO,
    ChatDTO,
    ChatListDTO,
    ExtendedChatUserDTO,
    MessageDTO,
} from "chat-dto";

export const ChatContext = createContext({
    activeChat: null as ChatDTO,
    changeActiveChat: (chatId: number) => {},
    selectedUser: null as ExtendedChatUserDTO,
    changeSelectedUser: (userId: number) => {},
    thisUsersChats: null as BasicChatWithUsersDTO[],
    fetchThisUsersChats: () => {},
});

export function ChatProvider({ children }) {
    const socket = useContext(SocketContext);
    const [activeChat, setActiveChat] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [thisUsersChats, setThisUsersChats] = useState(null);

    useEffect(() => {
        if (!socket) return;

        async function handleNewChatMessage(data: MessageDTO) {
            if (activeChat === null) return;
            if (data.chatId === activeChat.id) {
                try {
                    await changeActiveChat(data.chatId);
                } catch (error) {
                    console.error("Error fetching updated chat:", error);
                }
                // this would be far better, but would require a backend change
                /* 
                setActiveChat((prevActiveChat) => ({
                    ...prevActiveChat,
                    chatMessages: [...prevActiveChat.chatMessages, message],
                })); */
            }
        }

        async function handleChangeInChat(data: ChatListDTO) {
            try {
                if (data.chatId === activeChat?.id) {
                    await changeActiveChat(data.chatId);
                }

                fetchThisUsersChats();
            } catch (error) {
                console.error("Error handleChangeInChat:", error);
            }
        }

        socket.on("updateChat", handleChangeInChat);
        socket.on("updateMessage", handleNewChatMessage);

        return () => {
            socket.off("updateMessage", handleNewChatMessage);
        };
    }, [socket, activeChat]);

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

    useEffect(() => {
        fetchThisUsersChats();
    }, []);

    async function changeActiveChat(chatId: number) {
        if (chatId === null) {
            setActiveChat(null);
            setSelectedUser(null);
            return;
        }

        try {
            const apiUrl = backendUrl.chat + `complete_chat/${chatId}`;
            const newActiveChat = await fetchX<ChatDTO>("GET", apiUrl, null);
            setActiveChat(newActiveChat);
            setSelectedUser(null);
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

    const contextValue = {
        activeChat,
        changeActiveChat,
        selectedUser,
        changeSelectedUser,
        thisUsersChats,
        fetchThisUsersChats,
    };
    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
