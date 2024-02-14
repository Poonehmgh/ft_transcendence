import React, { useEffect, useState } from "react";

// DTO
import { Chat_ChatUsersDTO, Chat_CompleteDTO } from "src/dto/chat-dto";
import { fetchGet } from "src/functions/utils";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface chatListProps {
    activeChat: Chat_CompleteDTO | null;
    onSelectChat: (chat: Chat_ChatUsersDTO) => void;
    chats: Chat_ChatUsersDTO[];
}

function ChatList(props: chatListProps): React.JSX.Element {
    const [chatNames, setChatNames] = useState<string[]>(null);

    useEffect(() => {
        if (!props.chats) return;
        async function fetchChatNames() {
            try {
                const names = await Promise.all(
                    props.chats.map(async (chat) => {
                        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/chat/name/${chat.id}`;
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
        props.onSelectChat(chat);
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
                            props.activeChat?.id === e.id
                                ? "chatButtonSelected"
                                : "chatButton"
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
