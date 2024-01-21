import React from "react";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import NewChat from "./NewChat";
import ChatList from "./ChatList";

interface leftBarProps {
    selectedChatId: number | null;
    setSelectedChatId: React.Dispatch<React.SetStateAction<number | null>>;
}

function LeftBar(props: leftBarProps): React.JSX.Element {
    return (
        <div className="leftBar_0">
            <NewChat onCreateChat={props.setSelectedChatId} />

            <div className="leftBar_1">
                <ChatList
                    userId={0}
                    selectedChatId={props.selectedChatId}
                    onSelectChat={(chatId) => props.setSelectedChatId(chatId)}
                />
            </div>
        </div>
    );
}
export default LeftBar;
