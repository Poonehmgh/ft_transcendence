import React from "react";
import NewChat from "./NewChat/NewChat_main";
import ChatList from "./ChatList";
import ChatOptions from "./ChatOptions";
import PublicChats from "./PublicChats/PublicChats_main";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function LeftBar(): React.JSX.Element {
    return (
        <div className="sideBar">
            <div className="memberOptionsButtonsDiv">
                <PublicChats />
                <NewChat />
            </div>
            <ChatList />
            <ChatOptions />
        </div>
    );
}
export default LeftBar;
