import React, { useContext, useEffect, useState } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { AuthContext } from "src/contexts/AuthProvider";

// CSS
import "src/styles/style.css";
import "src/styles/chat.css";
import "src/styles/buttons.css";
import { ChatUserDTO } from "chat-dto";

function MemberOptions(): React.JSX.Element {
    const { activeChat, selectedUser } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (selectedUser) {
            const user = activeChat.chatUsers.find(
                (e: ChatUserDTO) => e.userId === userId
            );
            if (user) {
                if (user.owner) {
                    setRole("owner");
                }
                else if (user.admin) {
                    setRole("admin");
                }
            }
        }
    }, [selectedUser, activeChat.chatUsers]);

    async function changeRole(role: string) {
        console.log("change role to " + role);
    }

    if (!selectedUser || !role) return <div className="p"></div>;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                {`--- Change User Role ---`}
                <button className="bigButton" onClick={() => changeRole("owner")}>
                    Transfer ownership
                </button>
            </div>
        </div>
    );
}

export default MemberOptions;
