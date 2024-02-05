import React from "react";
import ChatList from "./ChatList";

// DTO
import { ChatInfoDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import ChatOptions from "./ChatOptions";

interface chatsMainProps {
    selectedChat: ChatInfoDTO;
    onSelectChat: (chat: ChatInfoDTO) => void;
    chats: ChatInfoDTO[];
}

function Chats(props: chatsMainProps): React.JSX.Element {
    return (
        <div>
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
