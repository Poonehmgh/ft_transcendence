import React, { useContext, useEffect, useRef, useState } from "react";
import LoadingH2 from "src/components/shared/LoadingH2";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";
import { AuthContext } from "src/contexts/AuthProvider";

// DTO
import { ChatInfoDTO, SendMessageDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface messageInputProps {
    selectedChat: ChatInfoDTO | null;
}

function MessageInput(props: messageInputProps): React.JSX.Element {
    const inputRef = useRef<HTMLInputElement>(null);
    const socket = useContext(SocketContext);
    const { userId } = useContext(AuthContext);

    useEffect(() => {
        const input = inputRef.current;

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                if (input.value.length > 0) {
                    sendMessage(input.value);
                    inputRef.current.value = "";
                }
            }
        };

        if (input) {
            input.addEventListener("keypress", handleKeyPress);
        }

        return () => {
            if (input) {
                input.removeEventListener("keypress", handleKeyPress);
            }
        };
    }, [inputRef]);

    function sendMessage(messageText: string) {
        const data = new SendMessageDTO(props.selectedChat?.id, userId, messageText);
        socket.emit("sendMessage", data);
        console.log("Message sent!");
    }

    if (!props.selectedChat) return null;

    return (
        <div className="inputDiv">
            <div className="messageDiv"></div>
            <input
                ref={inputRef}
                type="text"
                className="textInput"
                placeholder="Type a message..."
            />
            <button className="bigButton" style={{ width: "150px" }}>
                📤
            </button>
        </div>
    );
}

export default MessageInput;
