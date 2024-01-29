import React from "react";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface chatListProps {
    selectedChat: ChatListDTO;
    onSelectChat: (chat: ChatListDTO) => void;
    privateChats: ChatListDTO[];
    publicChats: ChatListDTO[];
}

function ChatList(props: chatListProps): React.JSX.Element {
    function selectChat(chat: ChatListDTO) {
        props.onSelectChat(chat);
    }

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">--- public chats ---</div>

            <div className="chatElementDiv">
                --- my chats ---
                {!props.privateChats ? (
                    <p>none</p>
                ) : (
                    props.privateChats.map(
                        (chat: { chatID: number; chatName: string }) => (
                            <button
                                key={chat.chatID}
                                className={
                                    props.selectedChat === chat
                                        ? "chatButtonSelected"
                                        : "chatButton"
                                }
                                onClick={() => selectChat(chat)}
                            >
                                {chat.chatName}
                            </button>
                        )
                    )
                )}
            </div>
        </div>
    );
}

export default ChatList;
