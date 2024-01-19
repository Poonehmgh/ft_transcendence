import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/chat.css";

interface chatListProps {
    userId: number;
    socket: SocketIOClient.Socket;
    selectedChatId: number;
    onSelectChat: (chatId: number) => void;
}

function ChatList(props: chatListProps): React.JSX.Element {
    const [privateChats, setPrivateChats] = useState<ChatListDTO[]>([]);
    const apiUrl_privateChats =
        process.env.REACT_APP_BACKEND_URL + "/chat/" + props.userId;
    // to do: add api for public chats and display in own area next to / above private chats

    useEffect(() => {
        fetchGetSet<ChatListDTO[]>(apiUrl_privateChats, setPrivateChats);
    }, [apiUrl_privateChats]);

    function selectChat(chatId: number) {
        props.onSelectChat(chatId);
    }

    return (
        <div className="leftBar_1">
            <p>Public Chats</p>

            <p>My Chats</p>
            {privateChats.map((chat: { chatID: number; chatName: string }) => (
                <button
                    key={chat.chatID}
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

export default ChatList;
