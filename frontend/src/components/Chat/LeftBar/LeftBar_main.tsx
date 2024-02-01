import React from "react";
import NewChat from "./NewChat";
import ChatList from "./ChatList";

// DTO
import { ChatListDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

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
            <NewChat selectChat={(newChat) => props.selectChat(newChat)} />

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
