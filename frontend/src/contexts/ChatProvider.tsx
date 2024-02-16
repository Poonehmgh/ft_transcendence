import React, { createContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchX } from "src/functions/utils";

// DTO
import { ExtendedChatUserDTO } from "chat-dto";

export const ChatContext = createContext({
    activeChat: null,
    changeActiveChat: (chatId: number) => {},
    selectedUser: null,
    changeSelectedUser: (userId: number) => {},
    thisUsersChats: null,
});

export function ChatProvider({ children }) {
    const [activeChat, setActiveChat] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [thisUsersChats, setThisUsersChats] = useState(null);

    useEffect(() => {
        async function fetchThisUsersChats() {
            try {
                const apiUrl = backendUrl.chat + "my_chats";
                const thisUsersChats = await fetchX("GET", apiUrl, null);
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
        thisUsersChats,
    };

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}
