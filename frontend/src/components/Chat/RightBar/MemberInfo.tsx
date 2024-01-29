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
                {"--- " + props.member.userName + " ---"}

                <table className="userTable">
                    <thead>
                        <tr>
                            <th>Owner</th>
                            <th>Admin</th>
                            <th>Online</th>
                            <th>Muted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{props.member.owner ? "✔️" : "❌"}</td>
                            <td>{props.member.admin ? "✔️" : "❌"}</td>
                            <td>{props.member.online ? "✔️" : "❌"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MemberInfo;
