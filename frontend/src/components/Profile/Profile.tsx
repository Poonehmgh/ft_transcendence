import Header from "../Header";
import React from "react";
import '../../styles/profile.css';
import UserProfile from "../UserProfile/UserProfile";

function Profile() {
  return (
      <div className="sections-container">
        <Header />
        <div className="section" id="center">
          {/*<UserProfile />*/}
        </div>
      </div>
  );
}

export default Profile;