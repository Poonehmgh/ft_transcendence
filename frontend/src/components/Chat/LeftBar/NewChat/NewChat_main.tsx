import React, { useContext, useRef, useState } from "react";
import Modal from "react-modal";
import CreateChatControls from "./CreateChatControls";
import { fetchX } from "src/functions/utils";
import SelectUsersTable from "./SelectUsersTable";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// DTO
import { BasicChatWithUsersDTO, NewChatDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

function NewChat(): React.JSX.Element {
    const { changeActiveChat, fetchThisUsersChats } = useContext(ChatContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const passwordRef = useRef(null);
    const [newChatDTO, setChatDto] = useState<NewChatDTO>({
        dm: false,
        isPrivate: true,
        password: null,
        userIds: [],
    });
    const apiUrl = backendUrl.chat + "create";

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
        setChatDto({
            dm: false,
            isPrivate: true,
            password: null,
            userIds: [],
        });
    }

    function setIsPrivate() {
        setChatDto((prevChatDto) => ({
            ...prevChatDto,
            isPrivate: !prevChatDto.isPrivate,
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

    async function createChat() {
        if (passwordRef.current) {
            newChatDTO.password = passwordRef.current.value;
        }
        try {
            const newChat: BasicChatWithUsersDTO = await fetchX(
                "POST",
                apiUrl,
                newChatDTO
            );
            changeActiveChat(newChat.id);
            fetchThisUsersChats();
            closeModal();
        } catch (error) {
            console.error("Error creating chat:", error);
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
                <SelectUsersTable onSelectedUsersChange={onSelectedUsersChange} />

                <CreateChatControls
                    newChatDTO={newChatDTO}
                    createChat={createChat}
                    setIsPrivate={setIsPrivate}
                    passwordRef={passwordRef}
                />

                <button className="closeX" onClick={closeModal}>
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default NewChat;
