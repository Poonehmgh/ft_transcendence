import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";

// DTO
import { ChatListDTO, ParticipantListElementDTO } from "chat-dto";

interface membersProps {
    selectedChat: ChatListDTO | null;
}

function Members(props: membersProps): React.JSX.Element {
    const [members, setMembers] = useState<ParticipantListElementDTO[]>([]);
    // temp to do
    const apiUrl =
        process.env.REACT_APP_BACKEND_URL +
        "/chat/" +
        props.selectedChat.chatID +
        "/participants";

    useEffect(() => {
        fetchGetSet<ParticipantListElementDTO[]>(apiUrl, setMembers);
    }, [props.selectedChat, apiUrl]);

    function selectMember(userId) {
        console.log("selectMember: ", userId);
    }

    /* 
   - interact with chat members
   - think of decision tree...

   */

    return (
        <div>
            <h2>Members:</h2>
            <ul>
                {members.map((member) => (
                    <li key={member.userName} onClick={() => selectMember(member.userId)}>
                        {member.userName}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Members;
