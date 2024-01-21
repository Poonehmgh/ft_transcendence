import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { ParticipantListElementDTO } from "chat-dto";

interface membersProps {
    selectedChatId: number;
}

function Members(props: membersProps): React.JSX.Element {
    const [members, setMembers] = useState<ParticipantListElementDTO[]>([]);
    // temp to do
    const userId = 0;
    const apiUrl =
        process.env.REACT_APP_BACKEND_URL + "/chat/" + userId + "/participants";

    useEffect(() => {
        fetchGetSet<ParticipantListElementDTO[]>(apiUrl, setMembers);
    }, []);

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
