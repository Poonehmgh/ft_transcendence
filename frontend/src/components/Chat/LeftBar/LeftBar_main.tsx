import React from "react";
import NewChat from "./NewChat/NewChat_main";
import Chats from "./Chats/Chats_main";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";
import PublicChats from "./PublicChats/PublicChats_main";

function LeftBar(): React.JSX.Element {
    return (
        <div className="sideBar">
            <div className="leftBarButtonContainer">
                <PublicChats />
                <NewChat />
            </div>
            <Chats />
        </div>
    );
}
export default LeftBar;
