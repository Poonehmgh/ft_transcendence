import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { UserProfileDTO } from "user-dto";
import { authContentHeader } from "src/ApiCalls/headers";
import Tabs from "./Tabs";
import "src/styles/modals.css";

interface MyProfileModal_prop {
  id: number;
}

function MyProfileModal(props: MyProfileModal_prop) {
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
        const url = process.env.REACT_APP_BACKEND_URL + "/user/profile?id=" + props.id;
        const response = await fetch(url, {
          method: "GET",
          headers: authContentHeader(),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setUserData(data);
        await fetchAvatar();
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }

  async function fetchAvatar() {
    const url = process.env.REACT_APP_BACKEND_URL + "/uploads/get_avatar/" + props.id;
    try {
      const response = await fetch(url, {
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
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/uploads/put_avatar/${props.id}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
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
      <button className="modal-button-big" onClick={openModal}>
        My Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="My Profile Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        {userData ? (
          <div>
            <h2 className="modal-h2">
              <div>
                {userData.name}
                <button className="modal-button-edit" onClick={handleNameChange}>
                  ✎
                </button>
                <div className="modal-p">
                  <img
                    src={avatarURL}
                    className="modal-avatar"
                    alt="User Avatar"
                    onClick={handleChooseFileClick}
                  />
                </div>
              </div>
              <div className="modal-expander"></div>
              <div>
                <br />
                <br />
                <table className="modal-table">
                  <tbody>
                    <tr>
                      <td className="modal-table">mmr</td>
                      <td className="modal-table">{userData.mmr}</td>
                    </tr>
                    <tr>
                      <td className="modal-table">rank</td>
                      <td className="modal-table">{userData.rank}</td>
                    </tr>
                    <tr>
                      <td className="modal-table">matches</td>
                      <td className="modal-table">{userData.matches}</td>
                    </tr>
                    <tr>
                      <td className="modal-table">win rate</td>
                      <td className="modal-table">{userData.winrate}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </h2>
			<Tabs />
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
        <button onClick={closeModal} className="modal-button-close">
          ❌
        </button>
      </Modal>
    </div>
  );
}

export default MyProfileModal;
