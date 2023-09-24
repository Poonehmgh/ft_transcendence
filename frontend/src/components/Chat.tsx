import Header from "./Header";
import React from "react";
import '../styles/chat.css';

function Chat() {
    return (
        <div className="sections-container">
          <Header />
          <div className="section chat-left-bar">Left Bar</div>
          <div className="section chat-center">
              <div>Chat</div>
          </div>
          <div className="section chat-upper-right-bar">Upper Right Bar</div>
          <div className="section chat-lower-right-bar">Lower Right Bar</div>
          <div className="section chat-footer">Footer</div>
        </div>
    );
}

export default Chat;