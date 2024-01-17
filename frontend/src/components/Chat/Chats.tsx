import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { ChatListDTO } from "chat-dto";

interface chatsProps {
    id: number;
    socket: SocketIOClient.Socket;
}

/*
list of chats:
    api: backend/chat/:userId
    return: ChatListDTO:
        chatName: string;
        chatID: number;
*/
function Chats(props: chatsProps): React.JSX.Element {
    const [chats, setChats] = useState<ChatListDTO[]>([]);

    useEffect(() => {
        // get user's chats
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/" + props.id;
        fetchGetSet(apiUrl, setChats);
        console.log("chats fetchgetset: ", chats);
    }, []);

    function joinChat(chat) {
        //socket.emit("joinChannel", channel);
        // update chats etc
    }

    return (
        <div>
            <h2>Chats:</h2>
            <ul>
                {chats.map((chat) => (
                    <li key={chat} onClick={() => joinChat(chat)}>
                        {chat}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Chats;
