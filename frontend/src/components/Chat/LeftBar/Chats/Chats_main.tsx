import React from "react";
import ChatList from "./ChatList";
import ChatOptions from "./ChatOptions";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function Chats(): React.JSX.Element {
    return (
        <div style={{ width: "100%" }}>
            <ChatList />
            <ChatOptions />
        </div>
    );
}
export default Chats;
