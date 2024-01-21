import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface chatListProps {
    userId: number;
    selectedChatId: number;
    onSelectChat: (chatId: number) => void;
}

function ChatList(props: chatListProps): React.JSX.Element {
    const [privateChats, setPrivateChats] = useState<ChatListDTO[]>([]);
    const [publicChats, setPublicChats] = useState<ChatListDTO[]>([]);

    const apiUrl_privateChats =
        process.env.REACT_APP_BACKEND_URL + "/chat/" + props.userId;
    const apiUrl_publicChats = process.env.REACT_APP_BACKEND_URL + "/public_chat";

    useEffect(() => {
        fetchGetSet<ChatListDTO[]>(apiUrl_privateChats, setPrivateChats);
        fetchGetSet<ChatListDTO[]>(apiUrl_publicChats, setPublicChats);
    }, []);

    function selectChat(chatId: number) {
        props.onSelectChat(chatId);
    }

    return (
        <div className="leftBar_1">
            <div className="chatList">--- public chats ---</div>

            <div className="chatList">
                --- my chats ---
                {privateChats.map((chat: { chatID: number; chatName: string }) => (
                    <button
                        key={chat.chatID}
                        className={
                            props.selectedChatId === chat.chatID
                                ? "chatButtonSelected"
                                : "bigButton"
                        }
                        onClick={() => selectChat(chat.chatID)}
                    >
                        {chat.chatName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ChatList;
