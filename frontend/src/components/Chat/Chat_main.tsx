import Header from "../Header/Header_main";
import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import io from "socket.io-client";
import Members from "./Members";

// CSS
import "../../styles/chat.css";

function Chat() {
	const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    const socket = io(process.env.REACT_APP_BACKEND_URL);

/* update:
            - chat msg history (last n=50?)
            - chat participants
            - chat options (depending on ownership etc)
            - visual representation of selected chat
        */
	
		/* const handleSelectChat = (chatId: number) => {
			 
			setSelectedChatId(chatId);
		}; */






    return (
        <div className="chat-sections-container">
            <Header />
            <div className="section chat-upper-left-bar">
                <ChatList userId={0} socket={socket} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId}/>
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
