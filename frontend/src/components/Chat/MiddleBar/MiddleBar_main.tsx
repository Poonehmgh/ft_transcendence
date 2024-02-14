import React from "react";
import MessageInput from "./MessageInput";
import MessageDisplay from "./MessageDisplay";

// DTO
import { ChatInfoDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface middleBarProps {
    selectedChat: ChatInfoDTO | null;
}

function MiddleBar(props: middleBarProps): React.JSX.Element {
    return (
        <div className="middleBar">
            <MessageDisplay
                selectedChat={props.selectedChat}
            />
            <MessageInput selectedChat={props.selectedChat} />
        </div>
    );
}

export default MiddleBar;
