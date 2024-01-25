import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/fetchers";
import { acceptRequest, declineRequest } from "src/functions/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function RequestInList() {
    const [group, setGroup] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/request_in";

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function handleDecline(index: number) {
        if (window.confirm(`Decline friend request from user ${group[index].name}?`)) {
            if (declineRequest(group[index].id)) {
                alert("Friend request declined");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error declining friend request");
            }
        }
    }

    function handleAccept(index: number) {
        if (window.confirm(`Accept friend request from user ${group[index].name}?`)) {
            if (acceptRequest(group[index].id)) {
                alert("Friend request accepted");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error accepting friend request");
            }
        }
    }

    return (
        <div className="p">
            {!group ? <p>Loading data...</p> : group.length === 0 ? (
                <p>No incoming requests. Go talk to ppl!</p>
            ) : (
                <table className="modalUserList">
                    <tbody>
                        {group.map((entry, index) => (
                            <tr key={entry.id}>
                                <td> {entry.name}</td>
                                <td>
                                    <button
                                        className="contactsButton"
                                        onClick={() => handleAccept(entry.id, index)}
                                    >
                                        🤝
                                    </button>
                                    <button
                                        className="contactsButton"
                                        onClick={() => handleDecline(entry.id, index)}
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

export default RequestInList;
