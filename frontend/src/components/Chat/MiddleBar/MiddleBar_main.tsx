import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";
import MessageInput from "./MessageInput";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";
import { AuthContext } from "src/contexts/AuthProvider";

// DTO
import {
    ChatInfoDTO,
    SendMessageDTO,
    MessageListElementDTO as MessageDTO,
} from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface middleBarProps {
    selectedChat: ChatInfoDTO | null;
}

function MiddleBar(props: middleBarProps): React.JSX.Element {
    const [chatmessages, setChatMessages] = useState<MessageDTO[]>(null);
    const apiUrl = backendUrl.chat + `${props.selectedChat?.id}/messages?from=0&to=0`;
    const inputRef = useRef<HTMLInputElement>(null);
    const socket = useContext(SocketContext);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        if (!socket) return;

        const handleNewEvent = (eventName, data) => {
            console.log("Received event:", eventName, "with data:", data);
        };
        socket.onAny(handleNewEvent);

        const handleNewChatMessage = (message: any) => {
            console.log("new chat message:", message);
            alert(`New chat message: ${message}`);
        };
        socket.on("updateMessage", handleNewChatMessage);

        return () => {
            socket.off("updateMessage", handleNewChatMessage);
            socket.offAny(handleNewEvent);
        };
    }, [socket]);

    useEffect(() => {
        fetchGetSet<MessageDTO[]>(apiUrl, setChatMessages);
    }, [apiUrl]);

    if (!chatmessages) return <LoadingH2 elementName={"Chat"} />;
    
    return (
        <div className="middleBar">
            <div className="messageDiv"></div>
            <MessageInput selectedChat={props.selectedChat}/>
        </div>
    );
}

export default MiddleBar;
