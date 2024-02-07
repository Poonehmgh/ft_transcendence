import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import LoadingH2 from "src/components/shared/LoadingH2";

// DTO
import { ChatInfoDTO, ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";
import backendUrl from "src/constants/backendUrl";

function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatInfoDTO | null>(null);
    const [selectedMember, setSelectedMember] = useState<ChatUserDTO | null>(null);

    // to do: move this to a central position after successful auth
    //const socket = io(process.env.REACT_APP_CHAT_URL);
    // to do temp

    const [chats, setChats] = useState<ChatInfoDTO[]>(null);
    const apiUrl = backendUrl.chat + "my_chats";

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
