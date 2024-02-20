import React, { useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper, sanitizeInput } from "src/functions/utils";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { ExtendedChatUserDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function ChatOptions(): React.JSX.Element {
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const {
        activeChat,
        changeActiveChat,
        updateMyChats: fetchThisUsersChats,
    } = useContext(ChatContext);
    const [hasPassword, setHasPassword] = useState<boolean>(false);

    useEffect(() => {
        if (activeChat && activeChat.chatUsers) {
            const userId = parseInt(localStorage.getItem("userId"));
            const thisUser = activeChat.chatUsers.find(
                (e: ExtendedChatUserDTO) => e.userId === userId
            );
            setIsOwner(thisUser?.owner || false);
            setHasPassword(activeChat.passwordRequired);
        }
    }, [activeChat]);

    async function leaveChat() {
        const promptText = activeChat.dm
            ? `Leave DM with ${activeChat.name}?`
            : `Leave ${activeChat.name}?`;
        if (window.confirm(promptText)) {
            const apiUrl = backendUrl.chat + `leave/${activeChat?.id}`;
            const res = await fetchWrapper<{ message: string }>("PATCH", apiUrl, null);
            alert(res.message);
            fetchThisUsersChats();
            changeActiveChat(null);
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
        const apiUrl = backendUrl.chat + `rename/${activeChat?.id}`;
        const res = await fetchWrapper<{ message: string }>("PATCH", apiUrl, {
            name: sanitizedName,
        });
        alert(res.message);
        fetchThisUsersChats();
        changeActiveChat(activeChat?.id);
    }

    async function removePassword() {
        if (!window.confirm("Are you sure you want to remove the password?")) return;
        const apiUrl = backendUrl.chat + `remove_password/${activeChat?.id}`;
        const res = await fetchWrapper<{ message: string }>("PATCH", apiUrl, null);
        alert(res.message);
        fetchThisUsersChats();
        changeActiveChat(activeChat?.id);
    }

    async function changePassword() {
        const newPassword = prompt("Enter new password:");
        if (!newPassword) return;
        if (newPassword.length < 3) {
            alert("Password must be at least 3 characters long");
            return;
        }
        const apiUrl = backendUrl.chat + `change_password/${activeChat?.id}`;
        const res = await fetchWrapper<{ message: string }>("PATCH", apiUrl, {
            password: newPassword,
        });
        alert(res.message);
        fetchThisUsersChats();
        changeActiveChat(activeChat?.id);
    }

    if (!activeChat) return null;

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
