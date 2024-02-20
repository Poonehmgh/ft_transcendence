import React, { useContext, useEffect, useState } from "react";
import MemberList from "./MemberList";
import MemberOptions from "./MemberOptions";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { AuthContext } from "src/contexts/AuthProvider";

// DTO
import { ChatRole, ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function RightBar(): React.JSX.Element {
    const { activeChat, selectedUser } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const [thisUserRole, setThisUserRole] = useState<ChatRole>(null);

    useEffect(() => {
        if (!activeChat || !activeChat.chatUsers) return;
        const thisUser = activeChat.chatUsers.find(
            (e: ChatUserDTO) => e.userId === userId
        );
        if (!thisUser) {
            console.error("User not found in chat");
            return;
        }

        if (thisUser.owner) {
            setThisUserRole(ChatRole.owner);
        } else if (thisUser.admin) {
            setThisUserRole(ChatRole.admin);
        } else {
            setThisUserRole(ChatRole.member);
        }
    }, [selectedUser, activeChat, activeChat?.chatUsers, userId]);

    if (activeChat === null || activeChat.chatUsers === null)
        return <div className="sideBar"></div>;

    return (
        <div className="sideBar">
            <MemberList thisUserRole={thisUserRole} />
            {selectedUser && selectedUser.userId !== userId && (
                <MemberOptions thisUserRole={thisUserRole} />
            )}
        </div>
    );
}

export default RightBar;
