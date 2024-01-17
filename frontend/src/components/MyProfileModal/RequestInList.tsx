import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { acceptRequest, declineRequest } from "src/ApiCalls/userActions";
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/contactsTable.css";

interface requestInListProps {
    id: number;
}

function RequestInList(props: requestInListProps) {
    const [group, setGroup] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/request_in/" + props.id;

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function handleDecline(id: number, index: number) {
        if (window.confirm(`Decline friend request from user ${group[index].name}?`)) {
            if (declineRequest(props.id, group[index].id)) {
                alert("Friend request declined");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error declining friend request");
            }
        }
    }

    function handleAccept(id: number, index: number) {
        if (window.confirm(`Accept friend request from user ${group[index].name}?`)) {
            if (acceptRequest(props.id, group[index].id)) {
                alert("Friend request accepted");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error accepting friend request");
            }
        }
    }

    return (
        <div>
            {!group || group.length === 0 ? (
                <p>No requests for now!</p>
            ) : (
                <table className="contacts-table">
                    <tbody className="contacts-table">
                        {group.map((entry, index) => (
                            <tr className="contacts-table" key={entry.id}>
                                <td className="contacts-table"> {entry.name}</td>
                                <td className="contacts-table">
                                    <button
                                        className="contacts-button"
                                        onClick={() => handleAccept(entry.id, index)}
                                    >
                                        🤝
                                    </button>
                                    <button
                                        className="contacts-button"
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
