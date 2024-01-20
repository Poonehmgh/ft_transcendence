import Header from "../Header/Header_main";
import React, { useEffect, useState } from "react";
import ChatList from "./ChatList";
import io from "socket.io-client";
import Members from "./Members";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";
import NewChat from "./NewChat";

function Chat() {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    // to do: move this to a central position after successful auth
    const socket = io(process.env.REACT_APP_CHAT_URL);

    return (
        <div>
            <div className="h2">Chat</div>
            <div className="chatMain">
                <div className="leftBar_0">
                    <NewChat userId={0} onCreateChat={setSelectedChatId} />

                    <div className="leftBar_1">
                        <ChatList
                            userId={0}
                            socket={socket}
                            selectedChatId={selectedChatId}
                            onSelectChat={() => setSelectedChatId}
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
