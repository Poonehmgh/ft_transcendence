import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import io from "socket.io-client";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";
import SelectUsersTable from "./SelectUsersTable";

interface newChatProps {
    userId: number;
    onCreateChat: (chatId: number) => void;
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
    // update this when actual API is known
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/new";

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    function selectChat(chatId: number) {
        props.onCreateChat(chatId);
    }

    function createDmChat() {
        console.log("createDmChat");
    }

    function createGroupChat() {
        console.log("createGroupChat");
    }

    function renderCreateChatButton() {
        if (selectedUsers.length === 1) {
            return (
                <button className="bigButton" onClick={createDmChat}>
                    Create DM Chat
                </button>
            );
        } else if (selectedUsers.length > 1) {
            return (
                <div>
                    <button className="bigButton" onClick={createGroupChat}>
                        Create Group Chat
                    </button>
                    <label>
                        <input type="checkbox" /> Use Password
                    </label>
                    <label>
                        <input type="checkbox" /> Public
                    </label>
                </div>
            );
        } else {
            return null;
        }
    }

    return (
        <div>
            <button className="bigButton" onClick={openModal}>
                +
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="New Chat"
                className="modal2"
                overlayClassName="modal-overlay"
            >
                <div className="modal-h2">Select Users</div>
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
