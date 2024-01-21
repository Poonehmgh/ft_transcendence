import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Members from "./Members";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";
import LeftBar from "./LeftBar";

function Chat() {
    const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
    // to do: move this to a central position after successful auth
    const socket = io(process.env.REACT_APP_CHAT_URL);

    return (
        <div>
            <div className="h2">{selectedChatId == null ? "Chat" : selectedChatId}</div>
            <div className="chatMain">
                <LeftBar
                    selectedChatId={selectedChatId}
                    setSelectedChatId={setSelectedChatId}
                />

                <div className="middleBar_0"></div>
                <div className="rightBar_0">
                    rightBar_0
                    <Members id={0} socket={socket} />
                </div>
            </div>
        </div>
    );
}

export default Chat;
