import React, { useContext, useEffect, useRef } from "react";

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

    const sendMessage = () => {
        if (inputRef.current.value.length === 0) return;
        const data = new SendMessageDTO(
            props.selectedChat.id,
            userId,
            inputRef.current.value
        );
        socket.emit("sendMessage", data);
        inputRef.current.value = "";
    };

    useEffect(() => {
        const input = inputRef.current;

        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "Enter") sendMessage();
        };

        if (input) {
            input.addEventListener("keypress", handleKeyPress);
        }

        return () => {
            if (input) {
                input.removeEventListener("keypress", handleKeyPress);
            }
        };
        // eslint-disable-next-line
        // sendMessage is missing, but is const and would trigger another eslint warning
    }, [props.selectedChat]);

    if (!props.selectedChat) return null;

    return (
        <div className="inputDiv">
            <input
                ref={inputRef}
                type="text"
                className="textInput"
                placeholder="Type a message..."
            />
            <button
                className="bigButton"
                style={{
                    width: "50px",
                    height: "100%",
                    borderRadius: "0px 0px 8px 0px",
                    boxSizing: "content-box",
                }}
                onClick={sendMessage}
            >
                <img
                    src="/images/sendButton.png"
                    alt="Send Message"
                    style={{ height: "25px", width: "auto" }}
                />
            </button>
        </div>
    );
}

export default MessageInput;
