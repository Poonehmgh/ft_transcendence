import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "../../styles/chat.css";

interface chatListProps {
    userId: number;
    socket: SocketIOClient.Socket;
	selectedChatId: number;
	onSelectChat: (chatId: number) => void;
}

/*
list of chats:
    api: backend/chat/:userId
    return: ChatListDTO:
        chatName: string;
        chatID: number;
*/
function ChatList(props: chatListProps): React.JSX.Element {
    const [chats, setChats] = useState<ChatListDTO[]>([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/" + props.userId;

    useEffect(() => {
       fetchGetSet<ChatListDTO[]>(apiUrl, setChats);
    }, [apiUrl]);

    function selectChat(chatId: number) {
        console.log("selectChat with id ", chatId);
		props.onSelectChat(chatId);
    }

    return (
		<div>
		  <h2>Chats:</h2>
		  <ul>
			{chats.map((chat: { chatID: number; chatName: string; }) => (
			  <li
				className={props.selectedChatId === chat.chatID ? "selected-chat" : ""}
				key={chat.chatID}
				onClick={() => selectChat(chat.chatID)}
			  >
				{chat.chatName}
			  </li>
			))}
		  </ul>
		</div>
	  );
}

export default ChatList;
