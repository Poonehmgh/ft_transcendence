import React, { useEffect, useState } from "react";
import { fetchGet, fetchGetSet } from "src/functions/utils";

// DTO
import { ChatInfoDTO, ChatUserDTO } from "src/dto/chat-dto";

interface membersProps {
    selectedChat: ChatInfoDTO | null;
    onSelectMember: (member: ChatUserDTO) => void;
}

function MemberList(props: membersProps): React.JSX.Element {
    const [chatUsers, setChatUsers] = useState<ChatUserDTO[]>(null);
    const [selectedChatUser, setSelectedChatUser] = useState<ChatUserDTO>(null);
	const [userNames, setUserNames] = useState<string[]>([]);

    const apiUrl =
        process.env.REACT_APP_BACKEND_URL + "/chat/chat_users/" + props.selectedChat.id;

    useEffect(() => {
        fetchGetSet<ChatUserDTO[]>(apiUrl, setChatUsers);
        console.log("ChatUsers: ", chatUsers);
    }, [props.selectedChat, apiUrl]);

    useEffect(() => {
        if (chatUsers) {
            // Fetch names using user IDs one at a time
            const apiNamesUrl = process.env.REACT_APP_BACKEND_URL + "/user/name/";

            const fetchName = async (userId, index) => {
                try {
                    const response = await fetchGet<string>(apiNamesUrl + userId);
                    const name = response || "Unknown Name";

                    // Update the user with the fetched name
                    setUserNames((prevNames) => {
                        const updatedNames = [...prevNames];
                        updatedNames[index] = name;
                        return updatedNames;
                    });
                } catch (error) {
                    console.error(`Error fetching name for user ${userId}:`, error);
                }
            };

            // Iterate through each user and fetch their name
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
