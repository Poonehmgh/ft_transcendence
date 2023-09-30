import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import { UserProfileDTO } from "user-dto";
import { getAvatar } from "src/ApiCalls/userActions";
import { authContentHeader } from "src/ApiCalls/headers";
import "src/styles/modals.css";

interface UserProfileModal_prop {
  id: number;
}

function UserProfileModal(props: UserProfileModal_prop) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userData, setUserData] = useState<UserProfileDTO | null>(null);
  //const [selectedFile, setSelectedFile] = useState(null);

  const fileInputRef = useRef(null);

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  /*  function handleFileChange(e: { target: { files: any[]; }; }) {
    setSelectedFile(e.target.files[0]);
  }
 */
  function handleChooseFileClick() {
    fileInputRef.current.click();
  }

  async function fetchData() {
    if (modalIsOpen) {
      try {
        const url = process.env.REACT_APP_BACKEND_URL + "/user/profile?id=1";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        const data = await response.json();
        setUserData(data);
        await getAvatar(props.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  }

  useEffect(() => {
    fetchData();
  }, [modalIsOpen]);

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
	formData.append("id", props.id);
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + `/uploads/put_avatar/${props.id}`,
        {
          method: "POST",
          body: formData, 
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
      fetchData();
    } catch (error) {
      alert(error);
    }
  }

  return (
    <div>
      <button className="button-big" onClick={openModal}>
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
              {userData.name}
              <button className="button-edit" onClick={handleNameChange}>
                ✎
              </button>
            </h2>
            <p className="modal-p">
              {userData.avatarURL ? (
                <img src={userData.avatarURL} className="img-avatar" alt="User Avatar" />
              ) : (
                <p>No profile picture available</p>
              )}
            </p>
            <table className="modals-table">
              <thead className="modals-table">
                <tr>
                  <th className="modals-table">mmr</th>
                  <th className="modals-table">rank</th>
                  <th className="modals-table">matches</th>
                  <th className="modals-table">win rate</th>
                </tr>
              </thead>
              <tbody>
                <td className="modals-table">{userData.mmr}</td>
                <td className="modals-table">{userData.rank}</td>
                <td className="modals-table">{userData.matches}</td>
                <td className="modals-table">{userData.winrate}</td>
              </tbody>
            </table>
            <br></br>

            <button className="button-big" onClick={() => console.log("knudelings")}>
              Manage Friends
            </button>
            <button className="button-edit" onClick={handleChooseFileClick}>
              ✎
            </button>
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
        <button onClick={closeModal} className="button-close">
          ❌
        </button>
      </Modal>
    </div>
  );
}

export default UserProfileModal;
