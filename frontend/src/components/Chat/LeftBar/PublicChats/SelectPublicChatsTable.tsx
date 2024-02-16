import React, { useContext, useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { SocketContext } from "src/contexts/SocketProvider";
import { AuthContext } from "src/contexts/AuthProvider";

// DTO
import { BasicChatDTO, InviteUserDTO } from "chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

function SelectPublicChatsTable(): React.JSX.Element {
    const { changeActiveChat } = useContext(ChatContext);
    const socket = useContext(SocketContext);
    const { userId } = useContext(AuthContext);
    const [publicChats, setPublicChats] = useState<BasicChatDTO[]>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const apiUrl = backendUrl.chat + "public_chats";
        fetchGetSet<BasicChatDTO[]>(apiUrl, setPublicChats);
    }, []);

    function handleChatSelection(chat: BasicChatDTO) {
        if (!window.confirm(`Join ${chat.name}?`)) return;
        let password = null;
        if (chat.passwordRequired) {
            password = prompt("Enter chat password");
            if (password === null) return;
            console.log(password);
        }
        const inviteUserDTO: InviteUserDTO = {
            chatId: chat.id,
            userId: userId,

            password: password,
        };
        socket.emit("inviteUser", inviteUserDTO);
        changeActiveChat(chat.id);
    }

    if (!publicChats) return <div>Loading data...</div>;

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
                                        {e.name}
                                        {e.passwordRequired ? " 🔐" : ""}
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
