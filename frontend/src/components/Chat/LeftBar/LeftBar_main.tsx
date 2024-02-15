import React from "react";
import NewChat from "./NewChat/NewChat_main";
import Chats from "./Chats/Chats_main";

// DTO
import { Chat_ChatUsersDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface leftBarProps {
    chats: Chat_ChatUsersDTO[];
}

function LeftBar(props: leftBarProps): React.JSX.Element {
    return (
        <div className="sideBar">
            <NewChat />

            <Chats chats={props.chats} />
        </div>
    );
}
export default LeftBar;
