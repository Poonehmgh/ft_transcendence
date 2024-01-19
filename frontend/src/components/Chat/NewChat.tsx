import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/chat.css";

interface newChatProps {
    userId: number;
    socket: SocketIOClient.Socket;
    onSelectChat: (chatId: number) => void;
}

function NewChat(props: newChatProps): React.JSX.Element {
    const [chats, setChats] = useState<ChatListDTO[]>([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/" + props.userId;

    /*
    open modal to select users
    - action button at bottom renders as "Create DM"
    - if more than 1 user selected, bottom renders as "Create Group Chat
        - then also renders option: private / public
        - and option: password
    
    */

    useEffect(() => {
        fetchGetSet<ChatListDTO[]>(apiUrl, setChats);
    }, [apiUrl]);

    function selectChat(chatId: number) {
        props.onSelectChat(chatId);
    }

    return (
        <div className="leftBar_1">
            {chats.map((chat: { chatID: number; chatName: string }) => (
                <button
                    className={
                        props.selectedChatId === chat.chatID
                            ? "chatButtonSelected"
                            : "chatButton"
                    }
                    onClick={() => selectChat(chat.chatID)}
                >
                    {chat.chatName}
                </button>
            ))}
        </div>
    );
}

export default NewChat;
