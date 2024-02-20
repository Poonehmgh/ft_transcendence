import React, { useContext } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { SocialDataContext } from "src/contexts/SocialDataProvider";

// DTO
import { BasicChatWithUsersDTO, ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import { IdAndNameDTO } from "user-dto";

function ChatList(): React.JSX.Element {
    const { activeChat, changeActiveChat, myChats } = useContext(ChatContext);
    const { blockedUsers } = useContext(SocialDataContext);

    function selectChat(chat: BasicChatWithUsersDTO) {
        changeActiveChat(chat.id);
    }

    if (!myChats) return <p>Loading...</p>;
    console.log("blockedUsers", blockedUsers);
    console.log("myChats: chatuseers", myChats.map((e) => e.chatUsers));

    const filteredChats = myChats.filter((chat) => {
        return (
            !chat.dm ||
            !chat.chatUsers?.some((chatUser: ChatUserDTO) =>
                blockedUsers?.some((blockedUser: IdAndNameDTO) => blockedUser.id === chatUser.userId)
            )
        );
    });

    return (
        <div className="chatElementDiv">
            {filteredChats.length === 0 ? (
                <div className="p">none</div>
            ) : (
                filteredChats.map((e: BasicChatWithUsersDTO) => (
                    <button
                        key={e.id}
                        className={
                            activeChat?.id === e.id ? "chatButtonSelected" : "chatButton"
                        }
                        onClick={() => selectChat(e)}
                    >
                        <div>{e.name}</div>
                        <span className="smallTextDiv">
                            {e.dm
                                ? " DM"
                                : e.isPrivate
                                ? " private Group"
                                : " public Group"}
                        </span>
                        <span style={{ fontSize: "small" }}>
                            {e.passwordRequired ? " 🔒" : ""}
                        </span>
                    </button>
                ))
            )}
        </div>
    );
}

export default ChatList;
