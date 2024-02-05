import React, { useEffect, useState } from "react";

// DTO
import { ChatInfoDTO } from "src/dto/chat-dto";
import { fetchGet } from "src/functions/utils";

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

    function leaveChat() {
        if (isOwner) {
            alert("You must transfer ownership before leaving this chat.");
            return;
        }
        if (window.confirm("Leave this chat?")) {
            // leave chat
        }
    }

    function renameChat() {}

    function removePassword() {}

    function changePassword() {}

    function addPassword() {}

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
                            <button className="chatButton" onClick={addPassword}>
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
