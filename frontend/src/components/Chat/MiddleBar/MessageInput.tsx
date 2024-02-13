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
        if (inputRef.current) {
            inputRef.current.addEventListener("keypress", handleKeyPress);
        }

        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener("keypress", handleKeyPress);
            }
        };
    }, [inputRef]);

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "Enter") sendMessage();
    };

    function sendMessage() {
        if (inputRef.current.value.length === 0) return;
        const data = new SendMessageDTO(
            props.selectedChat?.id,
            userId,
            inputRef.current.value
        );
        socket.emit("sendMessage", data);
        console.log("Message sent!");
        inputRef.current.value = "";
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
            <button
                className="bigButton"
                style={{ width: "150px" }}
                onClick={sendMessage}
            >
                📤
            </button>
        </div>
    );
}

export default MessageInput;
