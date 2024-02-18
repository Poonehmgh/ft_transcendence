import React, { useContext, useEffect, useState } from "react";

// Contexts
import { UserDataContext } from "src/contexts/UserDataProvider";

// DTO
import { IdAndNameDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function RequestOutList() {
    const { cancelFriendRequest, friendReqOut } = useContext(UserDataContext);

    if (friendReqOut === null) return <div className="p">Loading data...</div>;
    if (friendReqOut.length === 0)
        return <div className="p">No outgoing requests. Don't be shy!</div>;

    return (
        <table className="modalUserList">
            <tbody>
                {friendReqOut.map((e: IdAndNameDTO) => (
                    <tr key={e.id}>
                        <td>{e.name}</td>
                        <td>
                            <button
                                className="contactsButton"
                                onClick={() => cancelFriendRequest(e.id, e.name)}
                            >
                                ❌
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default RequestOutList;
