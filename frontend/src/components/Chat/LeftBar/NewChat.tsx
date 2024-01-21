import React, { useRef, useState } from "react";
import Modal from "react-modal";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";
import SelectUsersTable from "./SelectUsersTable";

interface newChatProps {
    onCreateChat: (chat: ChatListDTO) => void;
}

/*
newChatDTO
name: string;
    dm: boolean;
    pw_protected: boolean;
    password: string;
    chat_users: ChatUserDTO[] = [];

*/

function NewChat(props: newChatProps): React.JSX.Element {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [usePassword, setUsePassword] = React.useState(false);
    const passwordRef = useRef(null);
    // update this when actual API is known
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/new";

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setSelectedUsers([]);
        setModalIsOpen(false);
        setUsePassword(false);
    }

    function selectChat(chatId: number) {
        props.onCreateChat(chatId);
    }

    function createChat() {
        console.log("createChat");
        closeModal();
    }

    function setSelectedUsersCallBack(users: number[]) {
        setSelectedUsers(users);
    }

    function renderCreateChatButton() {
        function toggleInputBox() {
            setUsePassword(!usePassword);
        }

        if (selectedUsers.length === 1) {
            return (
                <button
                    className="bigButton"
                    style={{ width: "100%" }}
                    onClick={createChat}
                >
                    Create DM Chat
                </button>
            );
        } else if (selectedUsers.length > 1) {
            return (
                <div>
                    <button
                        className="bigButton"
                        style={{ width: "100%" }}
                        onClick={createChat}
                    >
                        Create Group Chat
                    </button>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <br />
                        <label className="checkboxContainer">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onChange={toggleInputBox}
                            />
                            Use Password
                            {usePassword && (
                                <div>
                                    <input
                                        type="text"
                                        className="textInput"
                                        style={{ marginLeft: "15px" }}
                                        placeholder="Enter your password"
                                        ref={passwordRef}
                                    />
                                </div>
                            )}
                        </label>

                        <br />
                        <label className="checkboxContainer">
                            <input type="checkbox" className="checkbox" /> Make Public
                        </label>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    return (
        <div style={{ width: "100%" }}>
            <button
                className="bigButton"
                style={{ fontSize: "2rem", color: "hsl(18, 100%, 50%)" }}
                onClick={openModal}
            >
                +
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="New Chat"
                className="modal2"
                overlayClassName="modalOverlay"
            >
                <SelectUsersTable setSelectedUsers={setSelectedUsersCallBack} />

                {renderCreateChatButton()}

                <button className="closeX" onClick={closeModal}>
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default NewChat;
