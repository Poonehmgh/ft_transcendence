import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import { handleUnBlockUser } from "src/functions/userActions";
import backendUrl from "src/constants/backendUrl";

// DTO
import { IdAndNameDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function BlockedList() {
    const [group, setGroup] = useState(null);
    const apiUrl = backendUrl.user + "blocked";

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function doUnblockUser(id: number, name: string) {
        handleUnBlockUser(id, name);
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }

    if (!group) return <div className="p">Loading data...</div>;
    if (group.length === 0) return <div className="p">No toxic ppl... yet!</div>;

    return (
        <table className="modalUserList">
            <tbody>
                {group.map((element) => (
                    <tr key={element.id}>
                        <td> {element.name}</td>
                        <td>
                            <button
                                className="contactsButton"
                                onClick={() => doUnblockUser(element.id, element.name)}
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
