import React, { useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper } from "src/functions/utils";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { SocketContext } from "src/contexts/SocketProvider";
import { AuthContext } from "src/contexts/AuthProvider";
import { ToastContext } from "src/contexts/ToastProvider";

// DTO
import { BasicChatDTO, JoinChatDTO } from "chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

function SelectPublicChatsTable({ closeModal }): React.JSX.Element {
    const { changeActiveChat, updateMyChats } = useContext(ChatContext);
    const socket = useContext(SocketContext);
    const { userId } = useContext(AuthContext);
    const { showToast } = useContext(ToastContext);
    const [publicChats, setPublicChats] = useState<BasicChatDTO[]>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        async function fetchPublicChats() {
            const apiUrl = backendUrl.chat + "public_chats";
            const data = await fetchWrapper<BasicChatDTO[]>("GET", apiUrl, null);
            setPublicChats(data);
        }

        fetchPublicChats();
    }, []);

    function handleChatSelection(chat: BasicChatDTO) {
        if (!window.confirm(`Join ${chat.name}?`)) return;
        let password = null;
        if (chat.passwordRequired) {
            password = prompt("Enter chat password");
            if (password === null) return;
        }
        const joinChatDto: JoinChatDTO = {
            chatId: chat.id,
            userId: userId,
            password: password,
        };
        socket.emit("joinChat", joinChatDto);
        closeModal();
    }

    if (!publicChats) return <div>Loading data...</div>;
    if(!Array.isArray(publicChats)) return <div>Loading data...</div>;

    const filteredChats = publicChats.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="chatSearchBox">
                <label htmlFor="search" className="h2Left">
                    Select Chat
                </label>
                <input
                    className="textInput"
                    type="text"
                    id="search"
                    placeholder="🔎"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "100%" }}
                />
            </div>
            {filteredChats.length === 0 ? (
                <p className="bigCenterEmoji">👻</p>
            ) : (
                <div className="chatUserListContainer">
                    <table className="chatUserTable">
                        <tbody>
                            {filteredChats.map((e) => (
                                <tr
                                    key={e.id}
                                    onClick={() => handleChatSelection(e)}
                                    style={{ cursor: "default" }}
                                >
                                    <td>
                                        <div
                                            style={{
                                                width: "100%",
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>{e.name}</div>
                                            <div>{e.passwordRequired ? " 🔐" : ""}</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default SelectPublicChatsTable;
