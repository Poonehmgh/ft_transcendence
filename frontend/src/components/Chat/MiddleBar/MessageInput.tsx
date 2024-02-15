import React, { useContext, useEffect, useRef } from "react";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";
import { AuthContext } from "src/contexts/AuthProvider";
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { SendMessageDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function MessageInput(): React.JSX.Element {
    const inputRef = useRef<HTMLInputElement>(null);
    const socket = useContext(SocketContext);
    const { userId } = useContext(AuthContext);
    const { activeChat } = useContext(ChatContext);

    const sendMessage = () => {
        if (inputRef.current.value.length === 0) return;
        const data = new SendMessageDTO(activeChat.id, userId, inputRef.current.value);
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
        // sendMessage is missing, but is const and would trigger another eslint warning
        // eslint-disable-next-line
    }, [activeChat]);

    if (!activeChat) return null;

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
