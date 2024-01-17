import Header from "../Header/Header_main";
import React from "react";
import Chats from "./Chats";
import io from "socket.io-client";
import Members from "./Members";

// CSS
import "../../styles/chat.css";

function Chat() {
    const socket = io(process.env.REACT_APP_BACKEND_URL);

    return (
        <div className="chat-sections-container">
            <Header />
            <div className="section chat-upper-left-bar">
                <Chats userId={0} socket={socket} />
            </div>
            <div className="section chat-lower-left-bar">New Channel</div>
            <div className="section chat-center">
                <div>Chat</div>
            </div>
            <div className="section chat-upper-right-bar">
				<Members id={0} socket={socket} />
				</div>
            <div className="section chat-lower-right-bar">Options</div>
            <div className="section chat-footer">Message Input</div>
        </div>
    );
}

export default Chat;
