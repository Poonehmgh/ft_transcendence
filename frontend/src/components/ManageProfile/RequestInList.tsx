import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/fetchers";
import { handleAcceptRequest, handleDeclineRequest } from "src/functions/userActions";

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

	function doDeclineRequest(id: number, name: string) {
		handleDeclineRequest(id, name);
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
	}

	function doAcceptRequest(id: number, name: string) {
		handleAcceptRequest(id, name);
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
	}

	if (!group) return <div className="p">Loading data...</div>;
	if (group.length === 0) return <div className="p">No incoming requests. Go talk to ppl!</div>;

    return (
                <table className="modalUserList">
                    <tbody>
                        {group.map((element) => (
                            <tr key={element.id}>
                                <td> {element.name}</td>
                                <td>
                                    <button
                                        className="contactsButton"
										onClick={() => doAcceptRequest(element.id, element.name)}
                                    >
                                        🤝
                                    </button>
                                    <button
                                        className="contactsButton"
                                        onClick={() => doDeclineRequest(element.id, element.name)}
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
