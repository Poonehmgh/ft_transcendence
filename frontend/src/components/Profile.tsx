import '../styles/style.css';
import Header from "./Header";
import React from "react";

function Profile() {
  return (
      <div className="sections-container">
        <Header />
        <div className="section" id="right-bar">Right Bar</div>
        <div className="section" id="center">
          {/*<UserProfile />*/}
        </div>
        <div className="section" id="left-bar">Left Bar</div>
        <div className="section" id="footer">Footer</div>
      </div>
  );
}

export default Profile;