import React, { useEffect, useState } from "react";

// DTO
import { ChatUserDTO } from "src/dto/chat-dto";
import { fetchGetSet } from "src/functions/utils";

// CSS
import "src/styles/style.css";
import "src/styles/chat.css";

interface memberInfoProps {
    member: ChatUserDTO | null;
}

function MemberInfo(props: memberInfoProps): React.JSX.Element {
    const [name, setName] = useState<string[]>([]);
    const apiUrl =
        process.env.REACT_APP_BACKEND_URL + "/user/name/" + props.member.userId;

    useEffect(() => {
        fetchGetSet(apiUrl, setName);
    }, [apiUrl]);

    if (!props.member) return <div className="p">Loading data...</div>;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                {"--- " + name + " ---"}

                <table className="chatMemberTable">
                    <thead>
                        <tr>
                            <th
                                colSpan={4}
                                style={{ borderBottom: "solid 1px", textAlign: "left" }}
                            >
                                Chat info
                            </th>
                        </tr>
                        <tr>
                            <th>Owner</th>
                            <th>Admin</th>
                            <th>Online</th>
                            <th>Muted</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{props.member.owner ? "yes" : "no"}</td>
                            <td>{props.member.admin ? "yes" : "no"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MemberInfo;
