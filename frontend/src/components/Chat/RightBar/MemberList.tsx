import React, { useEffect, useState } from "react";
import { fetchGet, fetchGetSet } from "src/functions/utils";
import backendUrl from "src/constants/backendUrl";

// DTO
import { Chat_ChatUsersDTO, ChatUserDTO } from "src/dto/chat-dto";

interface membersProps {
    selectedChat: Chat_ChatUsersDTO | null;
    onSelectMember: (member: ChatUserDTO) => void;
}

function MemberList(props: membersProps): React.JSX.Element {
    const [chatUsers, setChatUsers] = useState<ChatUserDTO[]>(null);
    const [selectedChatUser, setSelectedChatUser] = useState<ChatUserDTO>(null);
    const [userNames, setUserNames] = useState<string[]>([]);
    const apiUrl = backendUrl.chat + "chat_users/" + props.selectedChat.id;

    useEffect(() => {
        fetchGetSet<ChatUserDTO[]>(apiUrl, setChatUsers);
    }, [props.selectedChat, apiUrl]);

    useEffect(() => {
        if (chatUsers) {
            const apiNamesUrl = backendUrl.user + "name/";

            const fetchName = async (userId: number, index: number) => {
                try {
                    const response = await fetchGet<string>(apiNamesUrl + userId);
                    const name = response || "Unknown Name";

                    setUserNames((prevNames) => {
                        const updatedNames = [...prevNames];
                        updatedNames[index] = name;
                        return updatedNames;
                    });
                } catch (error) {
                    console.error(`Error fetching name for user ${userId}:`, error);
                }
            };
            chatUsers.forEach((user, index) => fetchName(user.userId, index));
        }
    }, [chatUsers]);

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
                {chatUsers.map((element, i) => (
                    <button
                        key={element.userId}
                        className={
                            selectedChatUser === element
                                ? "chatButtonSelected"
                                : "chatButton"
                        }
                        onClick={() => selectMember(element)}
                    >
                        {userNames[i]}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MemberList;
