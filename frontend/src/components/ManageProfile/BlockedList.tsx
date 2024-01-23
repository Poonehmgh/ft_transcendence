import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { unblockUser } from "src/ApiCalls/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

interface blockedListProps {
    id: number;
}

function BlockedList(props: blockedListProps) {
    const [group, setGroup] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/blocked/" + props.id;

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, []);

    function handleUnBlockUser(id: number, index: number) {
        if (window.confirm(`Unblock user ${group[index].name}?`)) {
            if (unblockUser(props.id, group[index].id)) {
                alert("User unblocked");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error unblocking user");
            }
        }
    }

    return (
        <div>
            {!group || group.length === 0 ? (
                <div className="p">No toxic ppl... yet!</div>
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
