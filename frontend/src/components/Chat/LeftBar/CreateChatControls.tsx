import React, { useRef, useState } from "react";
import Modal from "react-modal";
import SelectUsersTable from "./SelectUsersTable";

// DTO
import { ChatListDTO, NewChatDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface CreateChatControlsProps {
    createChat: () => void;
    //passwordref
    //function createchat
    setPrivate: () => void;
    //newchatdto
}

function CreateChatControls(props: CreateChatControlsProps): React.JSX.Element {
    const [showPasswordInput, setshowPasswordInput] = useState(false);
    const passwordRef = useRef(null);
    const [newChatDTO, setChatDto] = useState<NewChatDTO>({
        dm: false,
        private: true,
        password: null,
        userIds: [],
    });
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/create";

    if (newChatDTO.userIds.length === 0) return null;

    if (newChatDTO.userIds.length === 1) {
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

    if (newChatDTO.userIds.length > 1) {
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
                            onClick={() => setshowPasswordInput(!showPasswordInput)}
                        />
                        Use Password
                        {showPasswordInput && (
                                <input
                                    type="text"
                                    className="textInput"
                                    style={{ marginLeft: "15px" }}
                                    placeholder="Enter your knooldepassword"
                                    ref={passwordRef}
                                />
                        )}
                    </div>
                    <div className="checkboxContainer">
                        <input
                            type="checkbox"
                            className="checkbox"
                            onClick={props.setPrivate}
                        />
                        Make Public
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateChatControls;
