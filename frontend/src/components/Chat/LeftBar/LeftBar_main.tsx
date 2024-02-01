import React from "react";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import NewChat from "./NewChat";
import ChatList from "./ChatList";

interface leftBarProps {
    selectedChat: ChatListDTO | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatListDTO | null>>;
    privateChats: ChatListDTO[];
    publicChats: ChatListDTO[];
}

function LeftBar(props: leftBarProps): React.JSX.Element {
    return (
        <div className="leftBar_0">
            <NewChat onCreateChat={props.setSelectedChat} />

            <ChatList
                selectedChat={props.selectedChat}
                onSelectChat={(chat) => props.setSelectedChat(chat)}
                privateChats={props.privateChats}
                publicChats={props.publicChats}
            />
        </div>
    );
}
export default LeftBar;
