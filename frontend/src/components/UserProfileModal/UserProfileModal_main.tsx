import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { authContentHeader, fetchGetSet } from "src/functions/utils";
import PlayerCardTable from "../shared/PlayerCardTable";
import SocialActionBar from "./SocialActionBar/SocialActionBar_main";
import MatchHistory from "./MatchHistory";

// DTO
import { UserProfileDTO } from "src/dto/user-dto";

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
    const [userProfile, setUserProfile] = useState<UserProfileDTO | null>(null);
    const [avatarURL, setAvatarURL] = useState(null);
    const apiUrl_profile =
        process.env.REACT_APP_BACKEND_URL + "/user/profile/" + props.id;

    function closeModal() {
        props.onClose();
    }

    useEffect(() => {
        async function fetchAvatar() {
            const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/avatar/" + props.id;
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
        if (props.id) {
            fetchGetSet(apiUrl_profile, setUserProfile);
            fetchAvatar();
        }
    }, [props.isOpen, props.id, apiUrl_profile]);

    return (
        <div>
            <Modal
                isOpen={props.isOpen}
                onRequestClose={closeModal}
                contentLabel="User Profile"
                className="modal2"
                overlayClassName="modalOverlay"
            >
                {!userProfile ? (
                    <p>Loading user data...</p>
                ) : (
                    <div>
                        <h2 className="h2Left">{userProfile.name}</h2>

                        <div className="modal-avatar_playerCard">
                            <img
                                src={avatarURL}
                                className="modal-avatar"
                                alt="User Avatar"
                            />

                            <div className="modal-expander-hor"></div>
                            <PlayerCardTable
                                mmr={userProfile.mmr}
                                rank={userProfile.rank}
                                matches={userProfile.matches}
                                winrate={userProfile.winrate}
                            />
                        </div>
                        <SocialActionBar otherProfile={userProfile} />
                        <MatchHistory id={props.id} />
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
