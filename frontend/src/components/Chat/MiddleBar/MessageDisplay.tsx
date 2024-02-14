import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";

// DTO
import { ChatInfoDTO, MessageDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface messageDisplayProps {
    selectedChat: ChatInfoDTO | null;
}

function MessageDisplay(props: messageDisplayProps): React.JSX.Element {
    const [chatMessages, setChatMessages] = useState<MessageDTO[]>(null);
    const apiUrl = backendUrl.chat + `latest_messages/${props.selectedChat?.id}`;

    useEffect(() => {
        if (!props.selectedChat) return;
        fetchGetSet<MessageDTO[]>(apiUrl, setChatMessages);
    }, [props.selectedChat, apiUrl]);

    const formatTime = (timeStamp: Date): string => {
        const date = new Date(timeStamp);
        return date.toLocaleTimeString([], {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!chatMessages) return <LoadingH2 elementName={"Messages"} />;
    console.log("chatMessages", chatMessages);

    return (
        <div className="messagesArea">
            {chatMessages.map((message, index) => (
                <div key={index} className="message">
                    <span className="timeStamp">{formatTime(message.timeStamp)} - </span>
                    <span className="author">{message.authorId}:</span>
                    <div className="content">{message.content}</div>
                </div>
            ))}
        </div>
    );
}

export default MessageDisplay;
