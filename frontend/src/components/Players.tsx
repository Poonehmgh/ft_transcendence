import Header from "./Header";
import React from "react";
import '../styles/chat.css';

function Players() {
    return (
        <div className="chat-sections-container">
          <Header />
          <div className="section chat-upper-left-bar">Channels</div>
          <div className="section chat-lower-left-bar">New Channel</div>
          <div className="section chat-center">
              <div>Knismknang</div>
          </div>
          <div className="section chat-upper-right-bar">Chat Participants</div>
          <div className="section chat-lower-right-bar">Options</div>
          <div className="section chat-footer">Message Input</div>
        </div>
    );
}

export default Players;