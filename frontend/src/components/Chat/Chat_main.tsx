import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import Loading_h2 from "src/components/shared/Loading_h2";

// DTO
import { ChatListDTO, ParticipantListElementDTO as ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";

function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatListDTO | null>(null);
    const [selectedMember, setSelectedMember] = useState<ChatUserDTO | null>(null);

    // to do: move this to a central position after successful auth
    //const socket = io(process.env.REACT_APP_CHAT_URL);
    // to do temp
    const userId = 0;

    const [privateChats, setPrivateChats] = useState<ChatListDTO[]>(null);
    const [publicChats, setPublicChats] = useState<ChatListDTO[]>(null);

    const apiUrl_privateChats = process.env.REACT_APP_BACKEND_URL + "/chat/" + userId;
    const apiUrl_publicChats = process.env.REACT_APP_BACKEND_URL + "/public_chat";

    function selectChat(newChat: ChatListDTO) {
        setSelectedChat(newChat);
        setSelectedMember(null);
    }

    useEffect(() => {
        fetchGetSet<ChatListDTO[]>(apiUrl_privateChats, setPrivateChats);
        fetchGetSet<ChatListDTO[]>(apiUrl_publicChats, setPublicChats);
    }, [apiUrl_privateChats, apiUrl_publicChats]);

    if (!privateChats) <Loading_h2 elementName={"Chat"} />;

    return (
        <div className="mainContainerColumn">
            <div className="h2">{selectedChat ? selectedChat.chatName : "Chat"}</div>
            <div className="chatMain">
                <LeftBar
                    selectedChat={selectedChat}
                    selectChat={selectChat}
                    privateChats={privateChats}
                    publicChats={publicChats}
                />

                <div className="middleBar_0"></div>

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
