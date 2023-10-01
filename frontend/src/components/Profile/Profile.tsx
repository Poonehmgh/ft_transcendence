import Header from "../Header";
import React from "react";
import "../../styles/profile.css";
import UserProfile from "../UserProfile/UserProfile";
import { getUserID } from "../../functions/getUserID";
import MyProfileModal from "../modals/MyProfileModal";
import Modal from "react-modal";
import Tabs from "../modals/Tabs";

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
