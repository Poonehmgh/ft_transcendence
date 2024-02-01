import React, { useRef, useState } from "react";
import Modal from "react-modal";
import SelectUsersTable from "./SelectUsersTable";

// DTO
import { ChatListDTO, NewChatDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface CreateChatControlsProps {
    newChatDTO: NewChatDTO;
    createChat: () => void;
    //passwordref
    setIsPrivate: () => void;
}

function CreateChatControls(props: CreateChatControlsProps): React.JSX.Element {
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const passwordRef = useRef(null);
   
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/create";

    if (props.newChatDTO.userIds.length === 0) return null;

    if (props.newChatDTO.userIds.length === 1) {
        return (
            <button
                className="bigButton"
                style={{ width: "100%" }}
                onClick={props.createChat}
            >
                Create DM Chat
            </button>
        );
    }

    if (props.newChatDTO.userIds.length > 1) {
        return (
            <div>
                <button
                    className="bigButton"
                    style={{ width: "100%" }}
                    onClick={props.createChat}
                >
                    Create Group Chat
                </button>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <br />
                    <div className="checkboxContainer">
                        <input
                            type="checkbox"
                            className="checkbox"
                            onClick={() => setShowPasswordInput(!showPasswordInput)}
                        />
                        Use Password
                        {showPasswordInput && (
                            <input
                                type="text"
                                className="textInput"
                                style={{ marginLeft: "15px" }}
                                placeholder="Enter your password"
                                ref={passwordRef}
                            />
                        )}
                    </div>
                    <div className="checkboxContainer">
                        <input
                            type="checkbox"
                            className="checkbox"
                            onClick={props.setIsPrivate}
                        />
                        Make Public
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateChatControls;
