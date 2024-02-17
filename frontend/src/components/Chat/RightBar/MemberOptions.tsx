import React, { useContext, useEffect, useState } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { AuthContext } from "src/contexts/AuthProvider";

// CSS
import "src/styles/style.css";
import "src/styles/chat.css";
import "src/styles/buttons.css";
import { ChatUserDTO } from "chat-dto";

enum Role {
    owner = 2,
    admin = 1,
    member = 0,
}

function MemberOptions(): React.JSX.Element {
    const { activeChat, selectedUser } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);
    const [thisUserRole, setThisUserRole] = useState<Role>(null);
    const [selectedUserRole, setSelectedUserRole] = useState<Role>(null);

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

    async function changeRole(role: string) {
        console.log("change role to " + role);
    }

    async function muteUser() {
        console.log("mute user");
    }

    async function kickUser() {
        console.log("kick user");
    }

    async function banUser() {
        console.log("ban user");
    }

    if (!selectedUser || !thisUserRole) return <div className="p"></div>;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                <div className="memberOptionsButtonsDiv">
                    {thisUserRole === 2 && (
                        <button className="bigButton" onClick={() => changeRole("owner")}>
                            Transfer ownership
                        </button>
                    )}
                    {thisUserRole === 2 && !selectedUser.admin && (
                        <button className="bigButton" onClick={() => changeRole("admin")}>
                            Make Admin
                        </button>
                    )}
                    {thisUserRole === 2 && selectedUser.admin && (
                        <button
                            className="bigButton"
                            onClick={() => changeRole("member")}
                        >
                            Demote to Member
                        </button>
                    )}
                </div>

                {thisUserRole > selectedUserRole && (
                    <div className="memberOptionsButtonsDiv">
                        <button className="bigButton" onClick={() => muteUser()}>
                            Mute
                        </button>
                        <button className="bigButton" onClick={() => kickUser()}>
                            Kick
                        </button>
                        <button className="bigButton" onClick={() => banUser()}>
                            Ban
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberOptions;
