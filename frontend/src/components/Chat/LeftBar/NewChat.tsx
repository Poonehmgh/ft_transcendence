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
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [usePassword, setUsePassword] = React.useState(false);
    const [makePublic, setMakePublic] = React.useState(false);
    const passwordRef = useRef(null);
    const [chatDto, setChatDto] = useState<NewChatDTO>({
        dm: false,
        private: false,
        password: null,
        userIds: [],
    });
    
    
    
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/create";

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setSelectedUsers([]);
        setModalIsOpen(false);
        setUsePassword(false);
        setMakePublic(false);
    }

    /* export class NewChatDTO {
    dm: boolean;
    private: boolean;
    password?: string = null;

    userIds: number[];
} */

    function createChat() {
        let chatDto: NewChatDTO;
        chatDto.dm = selectedUsers.length === 1;
        chatDto.userIds = selectedUsers;
        chatDto.private = !makePublic;
        chatDto.password = passwordRef.current;
        const chatId: ChatListDTO = { chatName: "knudel", chatID: 0 };
        //receive chat id and set to selected chat
        props.selectChat(chatId);

        console.log("createChat: ", chatDto);
        closeModal();
    }

    function renderCreateChatButton() {
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
                        <div className="checkboxContainer">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onClick={() => setUsePassword(!usePassword)}
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
                        </div>
                        <div className="checkboxContainer">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onClick={() => setMakePublic(!makePublic)}
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
