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
    selectChat: React.Dispatch<React.SetStateAction<ChatListDTO | null>>;
    privateChats: ChatListDTO[];
    publicChats: ChatListDTO[];
}

function LeftBar(props: leftBarProps): React.JSX.Element {
    const newChat = null;
    return (
        <div className="sideBar">
            <NewChat onCreateChat={(newChat) => props.selectChat(newChat)} />

            <ChatList
                selectedChat={props.selectedChat}
                onSelectChat={(chat) => props.selectChat(chat)}
                privateChats={props.privateChats}
                publicChats={props.publicChats}
            />
        </div>
    );
}
export default LeftBar;
