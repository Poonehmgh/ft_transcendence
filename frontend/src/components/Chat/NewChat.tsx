import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import io from "socket.io-client";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { ChatListDTO } from "chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

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

    const [chats, setChats] = useState<ChatListDTO[]>([]);
    // update this when actual API is known
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/new";

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }
    /*
    open modal to select users
    - action button at bottom renders as "Create DM"
    - if more than 1 user selected, bottom renders as "Create Group Chat
        - then also renders option: private / public
        - and option: password
    
    */

    useEffect(() => {
        fetchGetSet<ChatListDTO[]>(apiUrl, setChats);
    }, [apiUrl]);

    function selectChat(chatId: number) {
        props.onCreateChat(chatId);
    }

    function createDM() {
        console.log("createDM");
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
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div>
                    <h2 className="modal-h2">New Chat</h2>
                </div>
                <button className="bigButton" onClick={createDM}>
                    Create DM
                </button>

                <button className="closeX" onClick={closeModal}>
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default NewChat;
