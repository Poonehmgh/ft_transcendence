import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/fetchers";
import { unblockUser } from "src/functions/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function BlockedList() {
    const [group, setGroup] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/blocked";

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function handleUnBlockUser(id: number, index: number) {
        if (window.confirm(`Unblock user ${group[index].name}?`)) {
            if (unblockUser(group[index].id)) {
                alert("User unblocked");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error unblocking user");
            }
        }
    }

    return (
        <div className="p">
            {!group ? <p>Loading data...</p> : group.length === 0 ? (
                <p>No toxic ppl... yet!</p>
            ) : (
                <table className="modalUserList">
                    <tbody>
                        {group.map((entry, index) => (
                            <tr key={entry.id}>
                                <td> {entry.name}</td>
                                <td>
                                    <button
                                        className="contactsButton"
                                        onClick={() => handleUnBlockUser(entry.id, index)}
                                    >
                                        ❌
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default BlockedList;
