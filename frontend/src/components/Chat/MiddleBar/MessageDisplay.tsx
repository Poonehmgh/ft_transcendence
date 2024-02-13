import React, { useContext, useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";
import MessageInput from "./MessageInput";

// DTO
import { ChatInfoDTO, MessageListElementDTO as MessageDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface messageDisplayProps {
    selectedChat: ChatInfoDTO | null;
}

function MessageDisplay(props: messageDisplayProps): React.JSX.Element {
    const [chatmessages, setChatMessages] = useState<MessageDTO[]>(null);
    const apiUrl = backendUrl.chat + `${props.selectedChat?.id}/messages?from=0&to=0`;

    useEffect(() => {
        fetchGetSet<MessageDTO[]>(apiUrl, setChatMessages);
    }, [apiUrl]);

    if (!chatmessages) return <LoadingH2 elementName={"Chat"} />;

    return (
            <div className="messageDiv"></div>
    );
}

export default MessageDisplay;
