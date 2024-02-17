import React, { useContext, useEffect, useState } from "react";
import UserProfileModal from "src/components/UserProfileModal/UserProfileModal_main";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { AuthContext } from "src/contexts/AuthProvider";
import { SocketContext } from "src/contexts/SocketProvider";

// DTO
import { ChatUserDTO, ChangeChatUserStatusDTO } from "chat-dto";

// CSS
import "src/styles/style.css";
import "src/styles/chat.css";
import "src/styles/buttons.css";

enum Role {
    owner = 2,
    admin = 1,
    member = 0,
}

function MemberOptions(): React.JSX.Element {
    const { activeChat, changeActiveChat, selectedUser } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [thisUserRole, setThisUserRole] = useState<Role>(null);
    const [selectedUserRole, setSelectedUserRole] = useState<Role>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // the role should already be an enum in the model
    useEffect(() => {
        if (selectedUser) {
            if (selectedUser.owner) {
                setSelectedUserRole(Role.owner);
            } else if (selectedUser.admin) {
                setSelectedUserRole(Role.admin);
            } else {
                setSelectedUserRole(Role.member);
            }

            const thisUser = activeChat.chatUsers.find(
                (e: ChatUserDTO) => e.userId === userId
            );
            if (!thisUser) {
                console.error("User not found in chat");
                return;
            }

            if (thisUser.owner) {
                setThisUserRole(Role.owner);
            } else if (thisUser.admin) {
                setThisUserRole(Role.admin);
            } else {
                setThisUserRole(Role.member);
            }
        }
    }, [selectedUser, activeChat.chatUsers]);

    async function changeUserStatus(action: string) {
        console.log("changeUserStatus. Received action:'" + action + "'");
        let data: ChangeChatUserStatusDTO = {
            operatorId: userId,
            chatId: activeChat.id,
            userId: selectedUser.userId,
            owner: false,
            muted: false,
            banned: false,
            admin: false,
            kick: false,
        };

        if (action === "owner") {
            if (!window.confirm(`Transfer ownership to ${selectedUser.userName}?`))
                return;
            data.owner = true;
        } else if (action === "admin") {
            if (!window.confirm(`Grant admin status to ${selectedUser.userName}?`))
                return;
            data.admin = true;
        } else if (action === "member") {
            if (!window.confirm(`Demote ${selectedUser.userName} to member?`)) return;
            data.admin = false;
        } else if (action === "mute") {
            if (!window.confirm(`Mute ${selectedUser.userName}?`)) return;
            data.muted = true;
        } else if (action === "kick") {
            if (!window.confirm(`Kick ${selectedUser.userName}?`)) return;
            data.kick = true;
        } else if (action === "ban") {
            if (!window.confirm(`Ban ${selectedUser.userName}?`)) return;
            data.banned = true;
        } else {
            console.error("Invalid action");
            return;
        }
        socket.emit("changeChatUserStatus", data);
        changeActiveChat(activeChat?.id);
    }

    function handleOpenModal() {
        setModalIsOpen(true);
    }

    function handleCloseModal() {
        setModalIsOpen(false);
    }

    if (!selectedUser || thisUserRole === null) return <div className="p"></div>;

    return (
        <div className="sideBar_sub1">
            <UserProfileModal
                id={selectedUser.userId}
                isOpen={modalIsOpen}
                onClose={handleCloseModal}
            />
            <div className="chatElementDiv">
                <div className="memberOptionsButtonsDiv">
                    <button className="bigButton" onClick={handleOpenModal}>
                        View Profile
                    </button>
                    <button
                        className="bigButton"
                        onClick={() => changeUserStatus("owner")}
                    >
                        Invite to Match
                    </button>
                </div>

                <div className="memberOptionsButtonsDiv">
                    {thisUserRole === 2 && (
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("owner")}
                        >
                            Transfer ownership
                        </button>
                    )}
                    {thisUserRole === 2 && !selectedUser.admin && (
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("admin")}
                        >
                            Make Admin
                        </button>
                    )}
                    {thisUserRole === 2 && selectedUser.admin && (
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("member")}
                        >
                            Demote to Member
                        </button>
                    )}
                </div>

                {thisUserRole > selectedUserRole && (
                    <div className="memberOptionsButtonsDiv">
                        <button
                            className="bigButton"
                            onClick={() =>
                                changeUserStatus(selectedUser.muted ? "unmute" : "mute")
                            }
                        >
                            {selectedUser.muted ? "Unmute" : "Mute"}
                        </button>
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("kick")}
                        >
                            Kick
                        </button>
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("ban")}
                        >
                            Ban
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberOptions;
