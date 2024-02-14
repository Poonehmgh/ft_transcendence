import React from "react";
import MemberList from "./MemberList";
import MemberInfo from "./MemberInfo";

// DTO
import { Chat_ChatUsersDTO, ChatUserDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

interface rightBarProps {
    selectedChat: Chat_ChatUsersDTO | null;
    selectedMember: ChatUserDTO | null;
    setSelectedMember: React.Dispatch<React.SetStateAction<ChatUserDTO | null>>;
}

function RightBar(props: rightBarProps): React.JSX.Element {
    return (
        <div className="sideBar">
            {props.selectedChat && (
                <MemberList
                    selectedChat={props.selectedChat}
                    onSelectMember={props.setSelectedMember}
                />
            )}
            {props.selectedMember && <MemberInfo member={props.selectedMember} />}
        </div>
    );
}

export default RightBar;
