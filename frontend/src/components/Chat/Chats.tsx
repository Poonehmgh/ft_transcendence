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
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/" + props.id;

    useEffect(() => {
       fetchGetSet<ChatListDTO[]>(apiUrl, setChats);
        //console.log("chats fetchgetset: ", chats);
    }, [apiUrl]);

    function selectChat(id: number) {
        console.log("selectChat with id ", id);
        /* update:
            - chat msg history (last n=50?)
            - chat participants
            - chat options (depending on ownership etc)
            - visual representation of selected chat
        */
    }

    return (
        <div>
            <h2>Chats:</h2>
            <ul>
                {chats.map((chat) => (
                    <li key={chat.chatID} onClick={() => selectChat(chat.chatID)}>
                        {chat.chatName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Chats;
