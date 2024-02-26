import React, { useContext } from "react";

// Contexts
import { SocialDataContext } from "src/contexts/SocialDataProvider";

// DTO
import { IdAndNameDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function RequestInList() {
    const { friendReqIn, acceptRequest, declineRequest } = useContext(SocialDataContext);

    if (friendReqIn === null) return <div className="p">Loading data...</div>;
    if (friendReqIn?.length === 0)
        return <div className="p">No incoming requests. Maybe u suck?</div>;
    if(!Array.isArray(friendReqIn)) return <div className="p">Loading data...</div>;

    return (
        <table className="modalUserList">
            <tbody>
                {friendReqIn?.map((e: IdAndNameDTO) => (
                    <tr key={e.id}>
                        <td> {e.name}</td>
                        <td>
                            <button
                                className="contactsButton"
                                onClick={() => acceptRequest(e.id, e.name)}
                            >
                                🤝
                            </button>
                            <button
                                className="contactsButton"
                                onClick={() => declineRequest(e.id, e.name)}
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

export default RequestInList;
