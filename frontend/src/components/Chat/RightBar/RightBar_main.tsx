import React, { useContext } from "react";
import MemberList from "./MemberList";
import MemberInfo from "./MemberInfo";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function RightBar(): React.JSX.Element {
    const { activeChat, selectedUser } = useContext(ChatContext);

    return (
        <div className="sideBar">
            {activeChat && <MemberList />}
            {activeChat && selectedUser && <MemberInfo />}
        </div>
    );
}

export default RightBar;
