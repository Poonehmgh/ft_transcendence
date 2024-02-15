import React, { useContext, useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";
import MiddleBar from "./MiddleBar/MiddleBar_main";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";
import { ChatProvider, ChatContext } from "src/contexts/ChatProvider";

// DTO
import { Chat_ChatUsersDTO } from "src/dto/chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";

function Chat() {
    const socket = useContext(SocketContext);
    const { activeChat } = useContext(ChatContext);
    const [chats, setChats] = useState<Chat_ChatUsersDTO[]>(null);
    const [updateTrigger, setUpdateTrigger] = useState(false);

    // update activechat if updatemessage.id === activechat.id

    useEffect(() => {
        if (!socket) return;

        const handleNewChatMessage = (message: any) => {
            alert(`New chat message: ${message.content}`);
            setUpdateTrigger((prev) => !prev);
            //better: add the message to the messages
        };
        socket.on("updateMessage", handleNewChatMessage);

        return () => {
            socket.off("updateMessage", handleNewChatMessage);
        };
    }, [socket]);

    useEffect(() => {
        const apiUrl = backendUrl.chat + "my_chats";
        fetchGetSet<Chat_ChatUsersDTO[]>(apiUrl, setChats); // update this
    }, [updateTrigger]);

    if (!chats) return <LoadingH2 elementName={"Chat"} />;

    return (
        <ChatProvider>
            <div className="mainContainerColumn">
                <div className="h2">{activeChat ? activeChat.name : "Chat"}</div>
                <div className="chatMain">
                    <LeftBar chats={chats} />
                    <MiddleBar />
                    <RightBar />
                </div>
            </div>
        </ChatProvider>
    );
}

export default Chat;
