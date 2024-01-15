import Header from "./Header";
import React from "react";
import '../styles/chat.css';
import UserProfile from "./UserProfile/UserProfile";

function Players() {
    return (
        <div className="chat-sections-container">
          <Header />
          <UserProfile SocialActionBar_prop={{ userId: 1, otherId: 0 }} />
        </div>
    );
}

export default Players;