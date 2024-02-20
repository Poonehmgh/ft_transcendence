import React, { createContext, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper } from "src/functions/utils";

// Contexts
import { SocketContext } from "./SocketProvider";

// DTO
import {
    BasicChatWithUsersDTO,
    ChatDTO,
    ExtendedChatUserDTO,
    MessageDTO,
    ChatIdDTO,
} from "chat-dto";

export const ChatContext = createContext({
    activeChat: null as ChatDTO,
    changeActiveChat: (chatId: number) => {},
    selectedUser: null as ExtendedChatUserDTO,
    changeSelectedUser: (userId: number) => {},
    myChats: null as BasicChatWithUsersDTO[],
    updateMyChats: () => {},
});

export function ChatProvider({ children }) {
    const socket = useContext(SocketContext);
    const [activeChat, setActiveChat] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [myChats, setMyChats] = useState(null);

    async function updateMyChats() {
        const apiUrl = backendUrl.chat + "my_chats";
        const newMyChats = await fetchWrapper<BasicChatWithUsersDTO[]>(
            "GET",
            apiUrl,
            null
        );
        setMyChats(newMyChats);
    }

    useEffect(() => {
        if (!socket) return;

        async function handleNewMessageEvent(data: MessageDTO) {
            if (activeChat === null) return;
            if (data.chatId === activeChat.id) {
                try {
                    await changeActiveChat(data.chatId);
                } catch (error) {
                    console.error("Error fetching updated chat:", error);
                }
            }
        }

        async function handleUpdateChatEvent(data: ChatIdDTO) {
            if (activeChat === null) return;
            try {
                if (data.chatId === activeChat.id) {
                    await changeActiveChat(data.chatId);
                }

                updateMyChats();
            } catch (error) {
                console.error("Error handleChangeInChat:", error);
            }
        }

        socket.on("newMessage", handleNewMessageEvent);
        socket.on("updateChat", handleUpdateChatEvent);

        return () => {
            socket.off("newMessage");
            socket.off("updateChat");
        };
    }, [socket, activeChat]);

    useEffect(() => {
        updateMyChats();
    }, []);

    async function changeActiveChat(chatId: number) {
        if (chatId === null) {
            setActiveChat(null);
            setSelectedUser(null);
            return;
        }

        const apiUrl = backendUrl.chat + `complete_chat/${chatId}`;
        const newActiveChat = await fetchWrapper<ChatDTO>("GET", apiUrl, null);
        setActiveChat(newActiveChat);
        setSelectedUser(null);
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
        myChats,
        updateMyChats,
    };

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
