import Header from "./Header";
import React from "react";
import '../styles/chat.css';

function Chat() {
    return (
        <div className="sections-container">
          <Header />
          <div className="section left-bar">Left Bar</div>
          <div className="section center">
              <div>Chat</div>
          </div>
          <div className="section right-bar">Right Bar</div>
          <div className="section footer">Footer</div>
        </div>
    );
}

export default Chat;