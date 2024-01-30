import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";

// DTO
import { ChatListDTO, ParticipantListElementDTO as ChatUserDTO } from "src/dto/chat-dto";
import { UserProfileDTO } from "src/dto/user-dto";

interface membersProps {
    selectedChat: ChatListDTO | null;
    onSelectMember: (member: ChatUserDTO) => void;
}

function MemberList(props: membersProps): React.JSX.Element {
    const [chatUsers, setChatUsers] = useState<ChatUserDTO[]>(null);
    const [selectedChatUser, setSelectedChatUser] = useState<ChatUserDTO>(null);

    // temp to do
    const apiUrl =
        process.env.REACT_APP_BACKEND_URL +
        "/chat/" +
        props.selectedChat.chatID +
        "/participants";

    useEffect(() => {
        fetchGetSet<ChatUserDTO[]>(apiUrl, setChatUsers);
    }, [props.selectedChat, apiUrl]);

    function selectMember(chatUser) {
        setSelectedChatUser(chatUser);
        props.onSelectMember(chatUser);
    }

    if (!chatUsers) return <div className="p">Loading data...</div>;

    /* 
   - interact with chat members
   - think of decision tree...

   */

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                --- chat members ---
                {chatUsers.map((element) => (
                    <button
                        key={element.userId}
                        className={
                            selectedChatUser === element
                                ? "chatButtonSelected"
                                : "chatButton"
                        }
                        onClick={() => selectMember(element)}
                    >
                        {element.userName}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MemberList;
