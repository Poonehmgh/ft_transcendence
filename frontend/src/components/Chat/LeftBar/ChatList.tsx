import React, { useEffect, useState } from "react";

// DTO
import { ChatInfoDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import { fetchGet } from "utils";

interface chatListProps {
    selectedChat: ChatInfoDTO;
    onSelectChat: (chat: ChatInfoDTO) => void;
    privateChats: ChatInfoDTO[];
    publicChats: ChatInfoDTO[];
}

function ChatList(props: chatListProps): React.JSX.Element {
    const [chatNames, setChatNames] = useState<string[]>([]);

    const fetchChatNames = async () => {
        const names: string[] = await Promise.all(
            props.privateChats.map((chat) => renderChatName(chat))
        );
        setChatNames(names);
    };

    useEffect(() => {
        fetchChatNames();
    }, [props.privateChats]);

    function selectChat(chat: ChatInfoDTO) {
        props.onSelectChat(chat);
    }

    async function renderChatName(chat: ChatInfoDTO): Promise<string> {
        const loggedInUserId = parseInt(localStorage.getItem("userId"));
        if (chat.dm) {
            const otherUser = chat.chatUsers.find(
                (user) => user.userId !== loggedInUserId
            );
            const apiUrl =
                process.env.REACT_APP_BACKEND_URL + "/user/name/" + otherUser.userId;
            const otherName = await fetchGet<string>(apiUrl);
            return otherName;
        }
        return "groupchat";
    }

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">--- public chats ---</div>

            <div className="chatElementDiv">
                --- my chats ---
                {!props.privateChats ? (
                    <p>none</p>
                ) : (
                    props.privateChats.map((element) => (
                        <button
                            key={element.id}
                            className={
                                props.selectedChat === element
                                    ? "chatButtonSelected"
                                    : "chatButton"
                            }
                            onClick={() => selectChat(element)}
                        >
                            {renderChatName(element)}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default ChatList;
