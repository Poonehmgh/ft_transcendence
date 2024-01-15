import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { UserProfileDTO } from "user-dto";
import { authContentHeader } from "src/ApiCalls/headers";
import PlayerCardTable from "../PlayerCardTable";
import "src/styles/modals.css";

interface userProfileModal_prop {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}

function UserProfileModal(props: userProfileModal_prop) {
  const [userData, setUserData] = useState<UserProfileDTO | null>(null);
  const [avatarURL, setAvatarURL] = useState(null);

  function closeModal() {
    props.onClose();
  }

  async function fetchProfile() {
	  const url = process.env.REACT_APP_BACKEND_URL + "/user/profile?id=" + props.id;
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
	if (props.id)
	{
		fetchProfile();
		fetchAvatar();
	}
  }, [props.isOpen, props.id]);

  return (
    <div>
      <Modal
        isOpen={props.isOpen}
        onRequestClose={closeModal}
        contentLabel="User Profile Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
		{!userData ? (
          <p>Loading user data...</p>
        ) :
          <div>
            <h2 className="modal-h2">
              {userData.name}
            </h2>

            <div className="modal-avatar_playerCard">
              <img src={avatarURL} className="modal-avatar" alt="User Avatar" />

              <div className="modal-expander-hor">
                <div className="modal-expander-ver" />
              </div>
              <PlayerCardTable
                mmr={userData.mmr}
                rank={userData.rank}
                matches={userData.matches}
                winrate={userData.winrate}
              />
            </div>
          </div>
        }
        <button onClick={closeModal} className="modal-button-close">
          ❌
        </button>
      </Modal>
    </div>
  );
}

export default UserProfileModal;
