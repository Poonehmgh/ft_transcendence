import Header from "../Header/Header_main";
import React from "react";
import '../../styles/chat.css';
import Channels from "./Channels";

function Chat() {
    return (
        <div className="chat-sections-container">
          <Header />
          <div className="section chat-upper-left-bar">
			<h2>Channels:</h2>
			<Channels id={0} />
			
				
			
			</div>
          <div className="section chat-lower-left-bar">New Channel</div>
          <div className="section chat-center">
              <div>Chat</div>
          </div>
          <div className="section chat-upper-right-bar">Chat Participants</div>
          <div className="section chat-lower-right-bar">Options</div>
          <div className="section chat-footer">Message Input</div>
        </div>
    );
}

export default Chat;