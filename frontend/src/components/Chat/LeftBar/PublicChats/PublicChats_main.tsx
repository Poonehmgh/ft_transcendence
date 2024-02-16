import React, { useContext, useRef, useState } from "react";
import Modal from "react-modal";
import SelectPublicChatsTable from "./SelectPublicChatsTable";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

function PublicChats(): React.JSX.Element {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    return (
        <div style={{ width: "100%" }}>
            <button
                className="bigButton"
                style={{
                    fontSize: "1.5rem",
                    marginBottom: "10px",
                }}
                onClick={openModal}
            >
                🌐
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Public Chats"
                className="chatModal"
                overlayClassName="chatModalOverlay"
            >
                <SelectPublicChatsTable />
                <button className="closeX" onClick={closeModal}>
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default PublicChats;
