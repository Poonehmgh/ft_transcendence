import React, { useContext } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { ExtendedChatUserDTO } from "src/dto/chat-dto";

function MemberList(): React.JSX.Element {
    const { activeChat, selectedUser, changeSelectedUser } = useContext(ChatContext);

    if (!activeChat || !activeChat.chatUsers)
        return <div className="p">Loading data...</div>;

    /* 
   - interact with chat members
   - think of decision tree...

   */

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                --- chat members ---
                {activeChat.chatUsers.map((e: ExtendedChatUserDTO) => (
                    <button
                        key={e.userId}
                        className={
                            selectedUser === e ? "chatButtonSelected" : "chatButton"
                        }
                        onClick={() => changeSelectedUser(e.userId)}
                    >
                        <div>{e.userName}</div>
                        <span className="smallTextDiv">
                            {e.owner ? "Owner" : e.admin ? "Admin" : "Member"}
                            {e.muted ? " | Muted" : ""}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MemberList;
