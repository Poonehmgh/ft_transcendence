import React, { useContext, useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";
import MiddleBar from "./MiddleBar/MiddleBar_main";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";

// DTO
import { Chat_ChatUsersDTO, Chat_CompleteDTO, ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";

function Chat() {
    const [selectedChat, setSelectedChat] = useState<Chat_ChatUsersDTO | null>(null);
    const [selectedMember, setSelectedMember] = useState<ChatUserDTO | null>(null);
    const [activeChat, setActiveChat] = useState<Chat_CompleteDTO | null>(null);
    const [chats, setChats] = useState<Chat_ChatUsersDTO[]>(null);
    const [updateTrigger, setUpdateTrigger] = useState(false);
	const socket = useContext(SocketContext);

	// remove selectedCHat. actually prolly only good in combo with provider
	// update activechat if updatemessage.id === activechat.id
	// maybe chat provider
	// add names here to complete chat

    useEffect(() => {
        if (!socket) return;

        const handleNewChatMessage = (message: any) => {
            alert(`New chat message: ${message.content}`);
			setUpdateTrigger(prev => !prev);
        };
        socket.on("updateMessage", handleNewChatMessage);

        return () => {
            socket.off("updateMessage", handleNewChatMessage);
        };
    }, [socket]);

    function selectChat(newChat: Chat_ChatUsersDTO) {
        setSelectedChat(newChat);
        setSelectedMember(null);
    }

    useEffect(() => {
        const apiUrl = backendUrl.chat + "my_chats";
        fetchGetSet<Chat_ChatUsersDTO[]>(apiUrl, setChats);
    }, [updateTrigger]);

    useEffect(() => {
        if (!selectedChat) return;
        const apiUrl = backendUrl.chat + `complete_chat/${selectedChat.id}`;
        fetchGetSet<Chat_CompleteDTO>(apiUrl, setActiveChat);
    }, [selectedChat, updateTrigger]);

    if (!chats) return <LoadingH2 elementName={"Chat"} />;

    return (
        <div className="mainContainerColumn">
            <div className="h2">{selectedChat ? selectedChat.name : "Chat"}</div>
            <div className="chatMain">
                <LeftBar activeChat={activeChat} selectChat={selectChat} chats={chats} />
                <MiddleBar activeChat={activeChat} />
                <RightBar
                    selectedChat={selectedChat}
                    selectedMember={selectedMember}
                    setSelectedMember={setSelectedMember}
                />
            </div>
        </div>
    );
}

export default Chat;
