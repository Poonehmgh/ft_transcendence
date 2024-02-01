import React, { useRef, useState } from "react";
import Modal from "react-modal";
import SelectUsersTable from "./SelectUsersTable";

// DTO
import { ChatListDTO, NewChatDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";
import CreateChatControls from "./CreateChatControls";

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

    function setIsPrivate() {
        setChatDto((prevChatDto) => ({
            ...prevChatDto,
            private: !prevChatDto.private,
        }));
    }

    function setIsDm(selectedUsers: number[]) {
        setChatDto((prevChatDto) => ({
            ...prevChatDto,
            dm: selectedUsers.length === 1,
        }));
    }

    function setSelectedUsers(selectedUsers: number[]) {
        setChatDto((prevChatDto) => ({
            ...prevChatDto,
            userIds: selectedUsers,
        }));
    }

    function onSelectedUsersChange(selectedUsers: number[]) {
        setSelectedUsers(selectedUsers);
        setIsDm(selectedUsers);
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
                <SelectUsersTable onSelectedUsersChange={onSelectedUsersChange} />

                <CreateChatControls
                    newChatDTO={newChatDTO}
                    createChat={createChat}
                    setIsPrivate={setIsPrivate}
                />

                <button className="closeX" onClick={closeModal}>
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default NewChat;
