import Header from "./Header";
import React from "react";
import '../styles/style.css';

function Chat() {
    return (
        <div className="sections-container">
          <Header />
          <div className="section" id="right-bar">Right Bar</div>
          <div className="section" id="center">
              <div>Chat</div>
          </div>
          <div className="section" id="left-bar">Left Bar</div>
          <div className="section" id="footer">Footer</div>
        </div>
    );
}

export default Chat;