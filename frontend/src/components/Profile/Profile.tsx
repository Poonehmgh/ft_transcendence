import Header from "../Header";
import React from "react";
import UserProfile from "../UserProfile/UserProfile";
import { getUserID } from "../../functions/getUserID";
import MyProfileModal from "../MyProfileModal/MyProfileModal";
import Modal from "react-modal";
import "../../styles/profile.css";

const userID = Number(getUserID());

Modal.setAppElement("#root");

function Profile() {
  return (
    <div className="sections-container">
      <Header />
      <div className="section profile-center">
        <UserProfile userId={1} />
		<MyProfileModal id={1}/>
      </div>
    </div>
  );
}

export default Profile;
