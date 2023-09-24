import Header from "./Header";
import React from "react";
import '../styles/chat.css';

function Chat() {
    return (
        <div className="chat-sections-container">
          <Header />
          <div className="chat-section chat-left-bar">Left Bar</div>
          <div className="chat-section chat-center">
              <div>Chat</div>
          </div>
          <div className="chat-section chat-upper-right-bar">Upper Right Bar</div>
          <div className="chat-section chat-lower-right-bar">Lower Right Bar</div>
          <div className="chat-section chat-footer">Footer</div>
        </div>
    );
}

export default Chat;