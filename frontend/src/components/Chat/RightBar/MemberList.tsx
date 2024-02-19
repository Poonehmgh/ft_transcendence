import React, { useContext } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { ChatRole, ExtendedChatUserDTO } from "src/dto/chat-dto";

interface memberListProps {
    thisUserRole: ChatRole;
}

function MemberList(props: memberListProps): React.JSX.Element {
    const { activeChat, selectedUser, changeSelectedUser } = useContext(ChatContext);

    if (!activeChat || !activeChat.chatUsers)
        return <div className="p">Loading data...</div>;

    const filteredChatUsers =
        props.thisUserRole < ChatRole.admin
            ? activeChat.chatUsers.filter((user) => !user.banned)
            : activeChat.chatUsers;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                {filteredChatUsers.map((e: ExtendedChatUserDTO) => (
                    <button
                        key={e.userId}
                        className={
                            selectedUser === e ? "chatButtonSelected" : "chatButton"
                        }
                        onClick={() => changeSelectedUser(e.userId)}
                    >
                        <div>{e.userName}</div>
                        <span className="smallTextDiv">
                            {e.owner
                                ? "Owner"
                                : e.admin
                                ? "Admin"
                                : e.banned
                                ? "Banned"
                                : "Member"}
                            {e.muted ? " | Muted" : ""}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MemberList;
