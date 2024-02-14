import React from "react";
import NewChat from "./NewChat/NewChat_main";
import Chats from "./Chats/Chats_main";

// DTO
import { Chat_ChatUsersDTO, Chat_CompleteDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface leftBarProps {
    activeChat: Chat_CompleteDTO | null;
    selectChat: React.Dispatch<React.SetStateAction<Chat_ChatUsersDTO | null>>;
    chats: Chat_ChatUsersDTO[];
}

function LeftBar(props: leftBarProps): React.JSX.Element {
    return (
        <div className="sideBar">
            <NewChat selectChat={(chat) => props.selectChat(chat)} />

            <Chats
                activeChat={props.activeChat}
                onSelectChat={(chat) => props.selectChat(chat)}
                chats={props.chats}
            />
        </div>
    );
}
export default LeftBar;
