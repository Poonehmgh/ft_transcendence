import { ExtendedChatUserDTO } from "chat-dto";
import React, { createContext, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchX } from "src/functions/utils";

export const ChatContext = createContext({
    activeChat: null,
    changeActiveChat: (chatId: number) => {},
    selectedUser: null,
    changeSelectedUser: (userId: number) => {},
});

export function ChatProvider({ children }) {
    const [activeChat, setActiveChat] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    async function changeActiveChat(chatId: number) {
        try {
            const apiUrl = backendUrl.chat + `complete_chat/${chatId}`;
            const newActiveChat = await fetchX("GET", apiUrl, null);
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

    const contextValue = {
        activeChat,
        changeActiveChat,
        selectedUser,
        changeSelectedUser,
    };

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
