import React, { useContext, useEffect, useState } from "react";
import UserProfileModal from "src/components/UserProfileModal/UserProfileModal_main";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { AuthContext } from "src/contexts/AuthProvider";
import { SocketContext } from "src/contexts/SocketProvider";

// DTO
import { ChangeChatUserStatusDTO, ChatRole } from "src/dto/chat-dto";

// CSS
import "src/styles/style.css";
import "src/styles/chat.css";
import "src/styles/buttons.css";

interface memberOptionsProps {
    thisUserRole: ChatRole;
}

function MemberOptions(props: memberOptionsProps): React.JSX.Element {
    const { activeChat, changeActiveChat, selectedUser } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const socket = useContext(SocketContext);
    const [selectedUserRole, setSelectedUserRole] = useState<ChatRole>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // the role should already be an enum in the model
    useEffect(() => {
        if (selectedUser) {
            if (selectedUser.owner) {
                setSelectedUserRole(ChatRole.owner);
            } else if (selectedUser.admin) {
                setSelectedUserRole(ChatRole.admin);
            } else {
                setSelectedUserRole(ChatRole.member);
            }
        }
    }, [selectedUser, activeChat.chatUsers, userId, props.thisUserRole]);

    async function changeUserStatus(action: string) {
        let data: ChangeChatUserStatusDTO = {
            operatorId: userId,
            chatId: activeChat.id,
            userId: selectedUser.userId,
            owner: false,
            muted: selectedUser.muted,
            banned: selectedUser.banned,
            admin: selectedUser.admin,
            kick: false,
        };

        // changing update method on backend would allow to completely
        // get rid of this monstrosity. just pass action into prompt and
        // send to backend
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
        } else if (action === "unmute") {
            if (!window.confirm(`Unmute ${selectedUser.userName}?`)) return;
            data.muted = false;
        } else if (action === "kick") {
            if (!window.confirm(`Kick ${selectedUser.userName}?`)) return;
            data.kick = true;
        } else if (action === "ban") {
            if (!window.confirm(`Ban ${selectedUser.userName}?`)) return;
            data.banned = true;
        } else if (action === "unban") {
            if (!window.confirm(`Unban ${selectedUser.userName}?`)) return;
            data.banned = false;
        } else {
            console.error("Invalid action");
            return;
        }
        socket.emit("changeChatUserStatus", data);
        changeActiveChat(activeChat?.id);
    }

    function inviteUserToMatch() {
        if (window.confirm(`Invite ${selectedUser.userName} to a pongers match?`))
            socket.emit("matchInvite", { recipientId: selectedUser.userId });
    }

    function handleOpenModal() {
        setModalIsOpen(true);
    }

    function handleCloseModal() {
        setModalIsOpen(false);
    }

    if (!selectedUser || props.thisUserRole === null) return <div className="p"></div>;

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
                    <button className="bigButton" onClick={() => inviteUserToMatch()}>
                        Invite to Match
                    </button>
                </div>

                <div className="memberOptionsButtonsDiv">
                    {props.thisUserRole === ChatRole.owner && (
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("owner")}
                        >
                            Transfer ownership
                        </button>
                    )}
                    {props.thisUserRole === ChatRole.owner && !selectedUser.admin && (
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("admin")}
                        >
                            Make Admin
                        </button>
                    )}
                    {props.thisUserRole === ChatRole.owner && selectedUser.admin && (
                        <button
                            className="bigButton"
                            onClick={() => changeUserStatus("member")}
                        >
                            Demote to Member
                        </button>
                    )}
                </div>

                {props.thisUserRole > selectedUserRole && (
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
                            onClick={() =>
                                changeUserStatus(selectedUser.banned ? "unban" : "ban")
                            }
                        >
                            {selectedUser.banned ? "Unban" : "Ban"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberOptions;
