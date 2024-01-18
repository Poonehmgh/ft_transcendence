import Header from "../Header/Header_main";
import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import io from "socket.io-client";
import Members from "./Members";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";

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
        <div className="sections-container">
            <Header />
			<div className="section" >

            <div className="leftBar_0">
                leftbar_0
				Chats
                <div className="leftBar_1">
                    <ChatList
                        userId={0}
                        socket={socket}
                        selectedChatId={selectedChatId}
                        onSelectChat={setSelectedChatId}
						/>
                </div>
            </div>

            <div className="middleBar_0">
                <div>middleBar_0</div>
            </div>
            <div className="rightBar_0">
                rightBar_0
				<Members id={0} socket={socket} />
            </div>
        </div>
		</div>
    );
}

export default Chat;
