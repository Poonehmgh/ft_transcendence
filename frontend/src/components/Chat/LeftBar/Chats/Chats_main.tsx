import React from "react";
import ChatList from "./ChatList";

// DTO
import { Chat_ChatUsersDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import ChatOptions from "./ChatOptions";

interface chatsMainProps {
    chats: Chat_ChatUsersDTO[];
}

function Chats(props: chatsMainProps): React.JSX.Element {
    return (
        <div style={{ width: "100%" }}>
            <ChatList chats={props.chats} />
            <ChatOptions />
        </div>
    );
}
export default Chats;
