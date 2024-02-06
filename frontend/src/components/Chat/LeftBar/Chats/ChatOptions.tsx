import React, { useEffect, useState } from "react";

// DTO
import { ChatInfoDTO } from "src/dto/chat-dto";
import { fetchGet, fetchX, sanitizeInput } from "src/functions/utils";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface chatOptionsProps {
    selectedChat: ChatInfoDTO | null;
}

function ChatOptions(props: chatOptionsProps): React.JSX.Element {
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [hasPassword, setHasPassword] = useState<boolean>(false);

    useEffect(() => {
        if (props.selectedChat) {
            const userId = parseInt(localStorage.getItem("userId"));
            const thisUser = props.selectedChat.chatUsers.find(
                (e) => e.userId === userId
            );
            setIsOwner(thisUser?.owner || false);
            setHasPassword(props.selectedChat.passwordRequired);
        }
    }, [props.selectedChat]);

    async function leaveChat() {
        if (window.confirm("Leave this chat?")) {
            const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/chat/leave/${props.selectedChat?.id}`;
            const res = await fetchGet<{ message: string }>(apiUrl);
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
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/chat/rename/${props.selectedChat?.id}`;
        const res = await fetchX<{ message: string }>("POST", apiUrl, {
            name: sanitizedName,
        });
        alert(res.message);
    }

    async function removePassword() {
        if (!window.confirm("Are you sure you want to remove the password?")) return;
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/chat/remove_password/${props.selectedChat?.id}`;
        const res = await fetchGet<{ message: string }>(apiUrl);
        alert(res.message);
    }

    async function changePassword() {
        const newPassword = prompt("Enter new password:");
        if (!newPassword) return;
        if (newPassword.length < 3) {
            alert("Password must be at least 3 characters long");
            return;
        }
        const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/chat/change_password/${props.selectedChat?.id}`;
        const res = await fetchX<{ message: string }>("POST", apiUrl, {
            password: newPassword,
        });
        alert(res.message);
    }

    if (!props.selectedChat) return null;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                --- chat options ---
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
