import React, { useEffect, useState } from "react";
import Members from "./Members";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import LeftBar from "./LeftBar/LeftBar";

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
    }, []);

    return (
        <div>
            <div className="h2">{selectedChat ? selectedChat.chatName : "Chat"}</div>
            <div className="chatMain">
                <LeftBar
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    privateChats={privateChats}
                    publicChats={publicChats}
                />

                <div className="middleBar_0"></div>
                <div className="rightBar_0">
                    rightBar_0
                    <Members selectedChatId={selectedChat} />
                </div>
            </div>
        </div>
    );
}

export default Chat;
