import React, { useContext, useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";

// DTO
import { ChatInfoDTO, ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";
import MiddleBar from "./MiddleBar/MiddleBar_main";

function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatInfoDTO | null>(null);
    const [selectedMember, setSelectedMember] = useState<ChatUserDTO | null>(null);
    const [chats, setChats] = useState<ChatInfoDTO[]>(null);
    const apiUrl = backendUrl.chat + "my_chats";
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (!socket) return;

        const handleNewEvent = (eventName, data) => {
            console.log("Received event:", eventName, "with data:", data);
        };
        socket.onAny(handleNewEvent);

        const handleNewChatMessage = (message: any) => {
            console.log("new chat message:", message);
            alert(`New chat message: ${message.content}`);
        };
        socket.on("updateMessage", handleNewChatMessage);

        return () => {
            socket.off("updateMessage", handleNewChatMessage);
            socket.offAny(handleNewEvent);
        };
    }, [socket]);

    function selectChat(newChat: ChatInfoDTO) {
        setSelectedChat(newChat);
        setSelectedMember(null);
    }

    useEffect(() => {
        fetchGetSet<ChatInfoDTO[]>(apiUrl, setChats);
    }, [apiUrl]);

    if (!chats) return <LoadingH2 elementName={"Chat"} />;

    return (
        <div className="mainContainerColumn">
            <div className="h2">{selectedChat ? selectedChat.name : "Chat"}</div>
            <div className="chatMain">
                <LeftBar
                    selectedChat={selectedChat}
                    selectChat={selectChat}
                    chats={chats}
                />
                <MiddleBar selectedChat={selectedChat} />
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
