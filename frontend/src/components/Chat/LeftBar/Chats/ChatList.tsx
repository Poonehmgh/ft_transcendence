import React, { useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { Chat_ChatUsersDTO } from "src/dto/chat-dto";
import { fetchGet } from "src/functions/utils";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface chatListProps {
    chats: Chat_ChatUsersDTO[];
}

function ChatList(props: chatListProps): React.JSX.Element {
    const [chatNames, setChatNames] = useState<string[]>(null);
    const { activeChat, changeActiveChat } = useContext(ChatContext);

    useEffect(() => {
        if (!props.chats) return;
        async function fetchChatNames() {
            try {
                const names = await Promise.all(
                    props.chats.map(async (chat) => {
                        const apiUrl = backendUrl.chat + `name/${chat.id}`;
                        const response = await fetchGet<{ name: string }>(apiUrl);
                        return response.name;
                    })
                );
                setChatNames(names);
            } catch (error) {
                console.error("Error fetching chat names:", error);
            }
        }
        fetchChatNames();
    }, [props.chats]);

    function selectChat(chat: Chat_ChatUsersDTO) {
        changeActiveChat(chat.id);
    }

    if (!chatNames || !props.chats) return <p>Loading...</p>;

    return (
        <div className="chatElementDiv">
            {props.chats.length === 0 ? (
                <div className="p">none</div>
            ) : (
                props.chats.map((e, index) => (
                    <button
                        key={e.id}
                        className={
                            activeChat?.id === e.id ? "chatButtonSelected" : "chatButton"
                        }
                        onClick={() => selectChat(e)}
                    >
                        <span>{chatNames[index]}</span>
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
