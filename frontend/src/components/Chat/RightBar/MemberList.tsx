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

            const fetchName = async (userId) => {
                try {
                    const response = await fetchGet<string>(apiNamesUrl + userId);
                    const name = response || "Unknown Name";

                    // Update the user with the fetched name
                    setChatUsers((prevUsers) => {
                        const updatedUsers = prevUsers.map((user) => {
                            if (user.userId === userId) {
                                return { ...user, userName: name };
                            }
                            return user;
                        });
                        return updatedUsers;
                    });
                } catch (error) {
                    console.error(`Error fetching name for user ${userId}:`, error);
                }
            };

            // Iterate through each user and fetch their name
            chatUsers.forEach((user) => fetchName(user.userId));
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
                        {element.userId}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default MemberList;
