import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/fetchers";
import { handleCancelRequest } from "src/functions/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function RequestOutList() {
    const [group, setGroup] = useState<IdAndNameDTO[]>(null);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/request_out";

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

	function doCancelRequest(id: number, name: string) {
		handleCancelRequest(id, name);
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
	}

	if (!group) return <div className="p">Loading data...</div>;
	if (group.length === 0) return <div className="p">No outgoing requests. Go make some friends!</div>;
	
	return (
		<table className="modalUserList">
			<tbody>
				{group.map((element) => (
					<tr key={element.id}>
						<td>{element.name}</td>
						<td>
							<button
								className="contactsButton"
								onClick={() => doCancelRequest(element.id, element.name)}
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

export default RequestOutList;
