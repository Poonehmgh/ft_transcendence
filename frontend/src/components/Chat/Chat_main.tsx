import React, { useContext, useEffect, useState } from "react";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import MiddleBar from "./MiddleBar/MiddleBar_main";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";
import { ChatProvider, ChatContext } from "src/contexts/ChatProvider";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";

function Chat() {
    const socket = useContext(SocketContext);
    const { activeChat } = useContext(ChatContext);

    return (
        <ChatProvider>
            <div className="mainContainerColumn">
                <div className="h2">{activeChat ? activeChat.name : "Chat"}</div>
                <div className="chatMain">
                    <LeftBar />
                    <MiddleBar />
                    <RightBar />
                </div>
            </div>
        </ChatProvider>
    );
}

export default Chat;
