import React, {useEffect, useState} from "react";
import { authContentHeader } from "src/ApiCalls/headers";
import { UserProfileDTO } from "user-dto";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import "src/styles/bigTable.css";
// not using pagination so far, we wont ever have that many users.
// but thats what "n" in the prop is for.

interface allUsersTable_prop {
    n: number;
}

function AllUsersTable(props: allUsersTable_prop): React.JSX.Element {
    const [allUsersTable, setAllUsersTable] = useState <UserProfileDTO[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [modalIsOpen, setModalIsOpen] = useState(false);
	  
	function handleNameClick(userId: number) {
		setSelectedUserId(userId);
		setModalIsOpen(true);
	}
	  
	const handleCloseModal = () => {
		setModalIsOpen(false);
	}

    useEffect(() => {
        void fetchAndSet(props.n, setAllUsersTable);
    }, [props.n]);

    if (allUsersTable.length === 0)
        return (
            <div>
                <br/>No users. Sadge.
            </div>
        );
    return (
		<div>
			<UserProfileModal id = {selectedUserId} isOpen = {modalIsOpen} onClose={handleCloseModal}/>
        <table className="big-table">
              <thead>
              <tr>
                <th>Name</th>
                <th>Rank</th>
                <th>MMR</th>
                <th>Matches</th>
                <th>Win Rate</th>
              </tr>
              </thead>
              <tbody>
                {allUsersTable.map((element: UserProfileDTO) => (
					<tr key = {element.id}>
						<td>
							<button className="modal-button-big" onClick={() => handleNameClick(element.id)}>
							{element.name}
							</button>
						</td>
                        <td>{element.rank}</td>
                        <td>{element.mmr}</td>
                        <td>{element.matches}</td>
                        <td>{element.winrate !== null ? element.winrate : "N/A"}</td>
                        <td>{element.online ? 'online' : 'offline'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
	</div>
    );
}

const fetchAndSet = async (n: number, setter: React.Dispatch<React.SetStateAction<ScoreCardDTO[]>>): Promise<void> => {
    try {
        const apiUrl =  process.env.REACT_APP_BACKEND_URL + "/user/all_users";
        const response = await fetch(apiUrl, {
            headers: authContentHeader()
        });
        const data = await response.json();
        setter(data);
    } catch (error) {
        console.error('Error fetching user/leaderboard:', error);
        setter([]);
    }
}

export default AllUsersTable;
