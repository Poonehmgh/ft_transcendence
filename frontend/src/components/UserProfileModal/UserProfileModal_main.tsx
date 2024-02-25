import React, { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import { authContentHeader, fetchWrapper } from "src/functions/utils";
import PlayerCardTable from "../shared/PlayerCardTable";
import SocialActionBar from "./SocialActionBar/SocialActionBar_main";
import MatchHistory from "./MatchHistory";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { AuthContext } from "src/contexts/AuthProvider";

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
    const { userId } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState<UserProfileDTO>(null);
    const [avatarURL, setAvatarURL] = useState(null);

    function closeModal() {
        props.onClose();
    }

    useEffect(() => {
        if (props.id === null) return;

        async function fetchAvatar() {
            const apiUrl = backendUrl.user + "avatar/" + props.id;
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

        async function fetchUserProfile() {
            const apiUrl = backendUrl.user + "profile/" + props.id;
            const data = await fetchWrapper<UserProfileDTO>("GET", apiUrl, null);
            setUserProfile(data);
        }

        fetchUserProfile();
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
                        {props.id === userId ? (
                            <div className="p" style={{ margin: "20px 0px" }}>
                                This is your profile.
                            </div>
                        ) : (
                            <SocialActionBar otherProfile={userProfile} />
                        )}
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
