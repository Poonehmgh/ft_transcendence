import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";

// DTO
import { ParticipantListElementDTO as ChatUserDTO } from "chat-dto";
import { UserProfileDTO } from "user-dto";

interface memberInfoProps {
    member: ChatUserDTO | null;
}

function MemberInfo(props: memberInfoProps): React.JSX.Element {
    if (!props.member) return <div className="p">Loading data...</div>;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                {"--- chat user info --" + props.member.userName}
            </div>
        </div>
    );
}

export default MemberInfo;
