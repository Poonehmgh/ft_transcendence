import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { authContentHeader } from "src/ApiCalls/headers";
import ManageContactsTabs from "./ManageContactsTabs";
import PlayerCardTable from "../shared/PlayerCardTable";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface myProfileModalProps {
    id: number;
}

function MyProfileModal(props: myProfileModalProps) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [userData, setUserData] = useState<UserProfileDTO | null>(null);
    const [avatarURL, setAvatarURL] = useState(null);

    function openModal() {
        setModalIsOpen(true);
    }

    function closeModal() {
        setModalIsOpen(false);
    }

    const fileInputRef = useRef(null);
    function handleChooseFileClick() {
        fileInputRef.current.click();
    }

    async function fetchProfile() {
        if (modalIsOpen) {
            try {
                const url =
                    process.env.REACT_APP_BACKEND_URL + "/user/profile?id=" + props.id;
                const response = await fetch(url, {
                    method: "GET",
                    headers: authContentHeader(),
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.log("Error fetching user data:", error);
            }
        }
    }

    async function fetchAvatar() {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/get_avatar/" + props.id;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: authContentHeader(),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setAvatarURL(imageUrl);
        } catch (error) {
            console.log("Error getting Avatar", error);
        }
    }

    useEffect(() => {
        fetchProfile();
        fetchAvatar();
    }, [modalIsOpen]);

    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);
        try {
            await fetch(
                process.env.REACT_APP_BACKEND_URL + `/user/put_avatar/${props.id}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
        } catch (error) {
            console.log(error);
        }
        fetchAvatar();
    }

    async function handleNameChange() {
        try {
            const newName = prompt("Enter a new name:");

            if (newName === null || newName.trim() === "") {
                return;
            }
            const data = {
                id: props.id,
                newName: newName,
            };
            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + "/user/change_name",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                const res_data = await response.json();
                alert(res_data.message);
            }
            fetchProfile();
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div>
            <button className="bigButton" onClick={openModal}>
                👤
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="My Profile"
                className="modal"
                overlayClassName="modal-overlay"
            >
                {userData ? (
                    <div>
                        <h2 className="modal-h2">
                            {userData.name}
                            <button className="editName" onClick={handleNameChange}>
                                ✎
                            </button>
                        </h2>

                        <div className="modal-avatar_playerCard">
                            <img
                                src={avatarURL}
                                className="modal-avatar"
                                alt="User Avatar"
                            />

                            <div className="modal-expander-hor">
                                <div className="modal-expander-ver" />
                                <button
                                    className="editAvatar"
                                    onClick={handleChooseFileClick}
                                >
                                    ✎
                                </button>
                            </div>
                            <PlayerCardTable
                                mmr={userData.mmr}
                                rank={userData.rank}
                                matches={userData.matches}
                                winrate={userData.winrate}
                            />
                        </div>

                        <ManageContactsTabs id={props.id} />

                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={handleAvatarChange}
                        />
                    </div>
                ) : (
                    <p>Loading user data...</p>
                )}
                <button onClick={closeModal} className="closeX">
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default MyProfileModal;
