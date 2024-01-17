import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { ParticipantListElementDTO } from "chat-dto";

interface membersProps {
    id: number;
    socket: SocketIOClient.Socket;
}

function Members(props: membersProps): React.JSX.Element {
    const [members, setMembers] = useState<ParticipantListElementDTO[]>([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/" + props.id + "/participants";

    useEffect(() => {
       fetchGetSet<ParticipantListElementDTO[]>(apiUrl, setMembers);
    }, [apiUrl]);

    function selectChat(id: number) {
        console.log("selectChat with id ", id);
        /* update:
            - chat msg history (last n=50?)
            - chat participants
            - chat options (depending on ownership etc)
            - visual representation of selected chat
        */
    }

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
