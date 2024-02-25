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

    async function updateMyChats(updatedChatId: number | null = null) {
        const apiUrl = backendUrl.chat + "my_chats";
        const newMyChats = await fetchWrapper<BasicChatWithUsersDTO[]>(
            "GET",
            apiUrl,
            null
        );
        setMyChats(newMyChats);
        if (updatedChatId && activeChat) {
            if (updatedChatId === activeChat.id) {
                changeActiveChat(updatedChatId);
            }
        }
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

                updateMyChats(data.chatId);
                if (!myChats.map((e) => e.id).includes(activeChat.id)) {
                    changeActiveChat(null);
                }
            } catch (error) {
                console.error("Error handleChangeInChat:", error);
            }
        }

        async function handleJoinChatSuccessEvent(data: { chatId: string }) {
            const chatId = parseInt(data.chatId, 10);
            if (isNaN(chatId)) {
                console.error("Invalid chatId:", data.chatId);
                return;
            }
            updateMyChats();
            changeActiveChat(chatId);
        }

        socket.on("newMessage", handleNewMessageEvent);
        socket.on("updateChat", handleUpdateChatEvent);
        socket.on("joinChatSuccess", handleJoinChatSuccessEvent);

        return () => {
            socket.off("newMessage");
            socket.off("updateChat");
            socket.off("joinChatSuccess");
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
        if ("error" in newActiveChat) {
            console.error("Error fetching chat:", newActiveChat.error);
            setActiveChat(null);
            setSelectedUser(null);
            return;
        }
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
