import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/fetchers";
import { cancelRequest } from "src/functions/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function RequestOutList() {
    const [group, setGroup] = useState<IdAndNameDTO[]>([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/request_out";

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function handleCancel(index: number) {
        if (window.confirm(`Cancel friend request to user ${group[index].name}?`)) {
            if (cancelRequest(group[index].id)) {
                alert("Friend request canceled");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error canceling friend request");
            }
        }
    }

    return (
        <div className="p">
            {!group ? <p>Loading data...</p> : group.length === 0 ? (
                <p>No outgoing requests. Go make some friends!</p>
            ) : (
                <table className="modalUserList">
                    <tbody>
                        {group.map((entry, index) => (
                            <tr key={entry.id}>
                                <td> {entry.name}</td>
                                <td>
                                    <button
                                        className="contactsButton"
                                        onClick={() => handleCancel(entry.id, index)}
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

export default RequestOutList;
