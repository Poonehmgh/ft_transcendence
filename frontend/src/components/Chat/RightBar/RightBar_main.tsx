import React from "react";
import Members from "./Members";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface rightBarProps {
    selectedChat: ChatListDTO | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatListDTO | null>>;
}

function RightBar(props: rightBarProps): React.JSX.Element {
    return (
        <div className="rightBar_0">
            {props.selectedChat && <Members selectedChat={props.selectedChat} />}
        </div>
    );
}

export default RightBar;
