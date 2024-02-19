import React, { useContext } from "react";

// Contexts
import { SocialDataContext } from "src/contexts/SocialDataProvider";

// DTO
import { IdAndNameDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function BlockedList() {
    const { blockedUsers, unblockUser } = useContext(SocialDataContext);

    if (blockedUsers === null) return <div className="p">Loading data...</div>;
    if (blockedUsers.length === 0) return <div className="p">No toxic ppl... yet!</div>;

    return (
        <table className="modalUserList">
            <tbody>
                {blockedUsers.map((e: IdAndNameDTO) => (
                    <tr key={e.id}>
                        <td> {e.name}</td>
                        <td>
                            <button
                                className="contactsButton"
                                onClick={() => unblockUser(e.id, e.name)}
                            >
                                🕊️
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default BlockedList;
