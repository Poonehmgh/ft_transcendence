import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { authContentHeader } from "src/functions/headers";
import PlayerCardTable from "../shared/PlayerCardTable";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface userProfileModalProps {
    id: number;
    isOpen: boolean;
    onClose: () => void;
}

function UserProfileModal(props: userProfileModalProps) {
    const [userData, setUserData] = useState<UserProfileDTO | null>(null);
    const [avatarURL, setAvatarURL] = useState(null);

    function closeModal() {
        props.onClose();
    }

    useEffect(() => {
        async function fetchProfile() {
            if (props.id == null) return;
            const url =
                process.env.REACT_APP_BACKEND_URL + "/user/profile/" + props.id;
            try {
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

        async function fetchAvatar() {
            const apiUrl =
                process.env.REACT_APP_BACKEND_URL + "/user/get_avatar/" + props.id;
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
        fetchProfile();
        fetchAvatar();
    }, [props.isOpen, props.id]);

    return (
        <div>
            <Modal
                isOpen={props.isOpen}
                onRequestClose={closeModal}
                contentLabel="User Profile"
                className="modal2"
                overlayClassName="modalOverlay"
            >
                {!userData ? (
                    <p>Loading user data...</p>
                ) : (
                    <div>
                        <h2 className="h2Left">{userData.name}</h2>

                        <div className="modal-avatar_playerCard">
                            <img
                                src={avatarURL}
                                className="modal-avatar"
                                alt="User Avatar"
                            />

                            <div className="modal-expander-hor"></div>
                            <PlayerCardTable
                                mmr={userData.mmr}
                                rank={userData.rank}
                                matches={userData.matches}
                                winrate={userData.winrate}
                            />
                        </div>
                    </div>
                )}
                <button className="closeX" onClick={closeModal}>
                    ❌
                </button>
            </Modal>
        </div>
    );
}

export default UserProfileModal;
