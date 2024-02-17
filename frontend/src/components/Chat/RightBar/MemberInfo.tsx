import React, { useContext } from "react";

// Contexts
import { ChatContext } from "src/contexts/ChatProvider";

// CSS
import "src/styles/style.css";
import "src/styles/chat.css";

function MemberInfo(): React.JSX.Element {
    const { selectedUser } = useContext(ChatContext);

    if (!selectedUser) return <div className="p"></div>;

    return (
        <div className="sideBar_sub1">
            <div className="chatElementDiv">
                {`--- ${selectedUser.userName} ---`}

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
                            <th>Muted</th>
                            <th>Invited</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{selectedUser.owner ? "yes" : "no"}</td>
                            <td>{selectedUser.admin ? "yes" : "no"}</td>
                            <td>{selectedUser.muted ? "yes" : "no"}</td>
                            <td>{selectedUser.invited ? "yes" : "no"}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MemberInfo;
