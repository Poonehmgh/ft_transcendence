import React from "react";
import NewChat from "./NewChat/NewChat_main";
import ChatList from "./Chats/ChatList";
import Chats from "./Chats/Chats_main";

// DTO
import { ChatInfoDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface leftBarProps {
    selectedChat: ChatInfoDTO | null;
    selectChat: React.Dispatch<React.SetStateAction<ChatInfoDTO | null>>;
    chats: ChatInfoDTO[];
}

function LeftBar(props: leftBarProps): React.JSX.Element {
    return (
        <div className="sideBar">
            <NewChat selectChat={(chat) => props.selectChat(chat)} />

            <Chats
                selectedChat={props.selectedChat}
                onSelectChat={(chat) => props.selectChat(chat)}
                chats={props.chats}
            />
        </div>
    );
}
export default LeftBar;
