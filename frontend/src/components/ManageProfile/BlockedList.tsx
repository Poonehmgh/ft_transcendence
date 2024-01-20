import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { unblockUser } from "src/ApiCalls/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/modals.css";

interface blockedListProps {
    id: number;
}

function BlockedList(props: blockedListProps) {
    const [group, setGroup] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/blocked/" + props.id;

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

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
                <p>No toxic ppl... yet!</p>
            ) : (
                <table className="contacts-table">
                    <tbody className="contacts-table">
                        {group.map((entry, index) => (
                            <tr className="contacts-table" key={entry.id}>
                                <td className="contacts-table"> {entry.name}</td>
                                <td className="contacts-table">
                                    <button
                                        className="contacts-button"
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
