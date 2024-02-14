import React, { useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";

// DTO
import { Chat_CompleteDTO } from "src/dto/chat-dto";
import { fetchX, sanitizeInput } from "src/functions/utils";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface chatOptionsProps {
    activeChat: Chat_CompleteDTO | null;
}

function ChatOptions(props: chatOptionsProps): React.JSX.Element {
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [hasPassword, setHasPassword] = useState<boolean>(false);

    useEffect(() => {
        if (props.activeChat) {
            const userId = parseInt(localStorage.getItem("userId"));
            const thisUser = props.activeChat.chatUsers.find((e) => e.userId === userId);
            setIsOwner(thisUser?.owner || false);
            setHasPassword(props.activeChat.passwordRequired);
        }
    }, [props.activeChat]);

    async function leaveChat() {
        if (window.confirm("Leave this chat?")) {
            const apiUrl = backendUrl.chat + `leave/${props.activeChat?.id}`;
            const res = await fetchX<{ message: string }>("PATCH", apiUrl, null);
            alert(res.message);
        }
    }

    async function renameChat() {
        const newName = prompt("Enter new chat name:");
        if (!newName) return;
        const sanitizedName = sanitizeInput(newName);
        if (sanitizedName.length < 3) {
            alert("Name must be at least 3 characters long");
            return;
        }
        const apiUrl = backendUrl.chat + `rename/${props.activeChat?.id}`;
        const res = await fetchX<{ message: string }>("PATCH", apiUrl, {
            name: sanitizedName,
        });
        alert(res.message);
    }

    async function removePassword() {
        if (!window.confirm("Are you sure you want to remove the password?")) return;
        const apiUrl = backendUrl.chat + `remove_password/${props.activeChat?.id}`;
        const res = await fetchX<{ message: string }>("PATCH", apiUrl, null);
        alert(res.message);
    }

    async function changePassword() {
        const newPassword = prompt("Enter new password:");
        if (!newPassword) return;
        if (newPassword.length < 3) {
            alert("Password must be at least 3 characters long");
            return;
        }
        const apiUrl = backendUrl.chat + `change_password/${props.activeChat?.id}`;
        const res = await fetchX<{ message: string }>("PATCH", apiUrl, {
            password: newPassword,
        });
        alert(res.message);
    }

    if (!props.activeChat) return null;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                <div className="sideBarDivider">chat options</div>
                <button className="chatButton" onClick={leaveChat}>
                    Leave Chat
                </button>
                {isOwner && (
                    <>
                        <button className="chatButton" onClick={renameChat}>
                            Rename Chat
                        </button>

                        {hasPassword ? (
                            <>
                                <button className="chatButton" onClick={removePassword}>
                                    Remove Password
                                </button>
                                <button className="chatButton" onClick={changePassword}>
                                    Change Password
                                </button>
                            </>
                        ) : (
                            <button className="chatButton" onClick={changePassword}>
                                Add Password
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ChatOptions;
