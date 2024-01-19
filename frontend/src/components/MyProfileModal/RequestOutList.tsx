import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { cancelRequest } from "src/ApiCalls/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/modals.css";

interface requestOutListProps {
    id: number;
}

function RequestOutList(props: requestOutListProps) {
    const [group, setGroup] = useState<IdAndNameDTO[]>([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/request_out/" + props.id;

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function handleCancel(id: number, index: number) {
        if (window.confirm(`Cancel friend request to user ${group[index].name}?`)) {
            if (cancelRequest(props.id, group[index].id)) {
                alert("Friend request canceled");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error canceling friend request");
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
