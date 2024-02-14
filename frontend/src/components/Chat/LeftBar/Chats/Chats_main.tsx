import React from "react";
import ChatList from "./ChatList";

// DTO
import { Chat_ChatUsersDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import ChatOptions from "./ChatOptions";

interface chatsMainProps {
    selectedChat: Chat_ChatUsersDTO;
    onSelectChat: (chat: Chat_ChatUsersDTO) => void;
    chats: Chat_ChatUsersDTO[];
}

function Chats(props: chatsMainProps): React.JSX.Element {
    return (
        <div style={{ width: "100%" }}>
            <ChatList
                selectedChat={props.selectedChat}
                onSelectChat={(chat) => props.onSelectChat(chat)}
                chats={props.chats}
            />
            <ChatOptions selectedChat={props.selectedChat} />
        </div>
    );
}
export default Chats;
