import Header from "../Header";
import React from "react";
import '../../styles/profile.css';
import UserProfile from "../UserProfile/UserProfile";
import {getUserID} from "../../functions/getUserID";

const userID = Number(getUserID());

function Profile() {
  return (
      <div className="sections-container">
        <Header />
        <div className="section profile-center">
          <UserProfile userId={userID}/>
        </div>
      </div>
  );
}

export default Profile;