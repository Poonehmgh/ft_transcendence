import React, { useContext } from "react";
import MemberList from "./MemberList";
import MemberInfo from "./MemberInfo";
import MemberOptions from "./MemberOptions";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";
import { AuthContext } from "src/contexts/AuthProvider";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function RightBar(): React.JSX.Element {
    const { activeChat, selectedUser } = useContext(ChatContext);
    const { userId } = useContext(AuthContext);

    if (!activeChat) return <div className="sideBar"></div>;

    return (
        <div className="sideBar">
            {<MemberList />}
            {selectedUser && <MemberInfo />}
            {selectedUser && selectedUser.userId != userId && <MemberOptions />}
        </div>
    );
}

export default RightBar;
