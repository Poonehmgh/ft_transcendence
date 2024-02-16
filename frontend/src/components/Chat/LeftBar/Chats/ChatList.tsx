import React, { useContext } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { BasicChatWithUsersDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function ChatList(): React.JSX.Element {
    const { activeChat, changeActiveChat, thisUsersChats } = useContext(ChatContext);

    function selectChat(chat: BasicChatWithUsersDTO) {
        changeActiveChat(chat.id);
    }

    if (!thisUsersChats) return <p>Loading...</p>;

    return (
        <div className="chatElementDiv">
            {thisUsersChats.length === 0 ? (
                <div className="p">none</div>
            ) : (
                thisUsersChats.map((e: BasicChatWithUsersDTO) => (
                    <button
                        key={e.id}
                        className={
                            activeChat?.id === e.id ? "chatButtonSelected" : "chatButton"
                        }
                        onClick={() => selectChat(e)}
                    >
                        <span>{e.name}</span>
                        <span className="smallTextDiv">
                            {e.dm
                                ? " DM"
                                : e.isPrivate
                                ? " private Group"
                                : " public Group"}
                        </span>
                    </button>
                ))
            )}
        </div>
    );
}

export default ChatList;
