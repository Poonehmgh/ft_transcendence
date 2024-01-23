import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";

function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatListDTO | null>(null);
    // to do: move this to a central position after successful auth
    //const socket = io(process.env.REACT_APP_CHAT_URL);
    // to do temp
    const userId = 0;

    const [privateChats, setPrivateChats] = useState<ChatListDTO[]>([]);
    const [publicChats, setPublicChats] = useState<ChatListDTO[]>([]);

    const apiUrl_privateChats = process.env.REACT_APP_BACKEND_URL + "/chat/" + userId;
    const apiUrl_publicChats = process.env.REACT_APP_BACKEND_URL + "/public_chat";

    useEffect(() => {
        fetchGetSet<ChatListDTO[]>(apiUrl_privateChats, setPrivateChats);
        fetchGetSet<ChatListDTO[]>(apiUrl_publicChats, setPublicChats);
    }, [apiUrl_privateChats, apiUrl_publicChats]);

    return (
        
        <div className="mainContainerColumn">
            <div className="h2">{selectedChat ? selectedChat.chatName : "Chat"}</div>
            <div className="chatMain">
                <LeftBar
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    privateChats={privateChats}
                    publicChats={publicChats}
                />

                <div className="middleBar_0"></div>

                <RightBar selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
            </div>
        </div>
    );
}

export default Chat;
