import React, { useContext, useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";

// DTO
import { ChatInfoDTO, ChatUserDTO, SendMessageDTO } from "src/dto/chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";

function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatInfoDTO | null>(null);
    const [selectedMember, setSelectedMember] = useState<ChatUserDTO | null>(null);
    const [chats, setChats] = useState<ChatInfoDTO[]>(null);
    const apiUrl = backendUrl.chat + "my_chats";

    const socket = useContext(SocketContext);

    useEffect(() => {
        if (!socket) return;
        const handleNewChatMessage = (message: any) => {
            alert(`New chat message: ${message}`);
        };

        socket.on("chat message", handleNewChatMessage);

        return () => {
            socket.off("chat message", handleNewChatMessage);
        };
    }, [socket]);

    function sendTestMsg() {
        console.log("sending test msg");
        const id_message = { userID: 98525 };
        socket.emit("sendMessage", id_message);

        const message = new SendMessageDTO(1, 98525, "Hello, knudelings!");
        socket.emit("sendMessage", message);
    }

    function sendAuthMsg() {
        console.log("sending auth msg");
        const id_message = { userID: 98525 };
        socket.emit("connectMessage", id_message);

        const message = new SendMessageDTO(1, 98525, "Hello, knudelings!");
        socket.emit("sendMessage", message);
    }

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

                <div className="middleBar_0">
                    <button className="bigButton" onClick={sendTestMsg}>
                        Knudeling
                    </button>
                    <button className="bigButton" onClick={sendAuthMsg}>
                        send auth
                    </button>
                </div>

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
