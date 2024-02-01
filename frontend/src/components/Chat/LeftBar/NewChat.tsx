import React, { useRef, useState } from "react";
import Modal from "react-modal";
import SelectUsersTable from "./SelectUsersTable";

// DTO
import { ChatListDTO, NewChatDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface newChatProps {
    selectChat: (chat: ChatListDTO) => void;
}

function NewChat(props: newChatProps): React.JSX.Element {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [showPasswordInput, setshowPasswordInput] = useState(false);
    const passwordRef = useRef(null);
    const [newChatDTO, setChatDto] = useState<NewChatDTO>({
        dm: false,
        private: true,
        password: null,
        userIds: [],
    });
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/create";

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
        setshowPasswordInput(false);
        setChatDto({
            dm: false,
            private: true,
            password: null,
            userIds: [],
        });
    }

    function setPrivate() {
        setChatDto((prevChatDto) => ({
            ...prevChatDto,
            private: !prevChatDto.private,
        }));
    }

    function setSelectedUsers(selectedUsers: number[]) {
        setChatDto((prevChatDto) => ({
            ...prevChatDto,
            userIds: selectedUsers,
        }));
    }

    function createChat() {
        newChatDTO.dm = newChatDTO.userIds.length === 1;
        newChatDTO.password = passwordRef.current;
        const newChat: ChatListDTO = { chatName: "knudel", chatID: 0 };
        //receive chat id and set to selected chat
        props.selectChat(newChat);

        console.log("createChat: ", newChatDTO);
        closeModal();
    }

    function renderCreateChatButton() {
        if (newChatDTO.userIds.length === 1) {
            return (
                <button
                    className="bigButton"
                    style={{ width: "100%" }}
                    onClick={createChat}
                >
                    Create DM Chat
                </button>
            );
        } else if (newChatDTO.userIds.length > 1) {
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
                        <div className="checkboxContainer">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onClick={() => setshowPasswordInput(!showPasswordInput)}
                            />
                            Use Password
                            {showPasswordInput && (
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
                        </div>
                        <div className="checkboxContainer">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onClick={setPrivate}
                            />
                            Make Public
                        </div>
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
                style={{
                    fontSize: "2rem",
                    color: "hsl(18, 100%, 50%)",
                    marginBottom: "10px",
                }}
                onClick={openModal}
            >
                +
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="New Chat"
                className="chatModal"
                overlayClassName="chatModalOverlay"
            >
                <SelectUsersTable setSelectedUsers={setSelectedUsers} />

                {renderCreateChatButton()}

                <button className="closeX" onClick={closeModal}>
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default NewChat;
