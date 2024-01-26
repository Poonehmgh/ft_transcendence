import React, { useEffect, useState } from "react";
import { UserProfileDTO } from "user-dto";
import UserProfileModal from "../UserProfileModal/UserProfileModal_main";
import "src/styles/bigTable.css";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// not using pagination so far, we wont ever have that many users.
// but thats what the propdata are for.
interface allUsersTable_prop {
    startIndex: number;
    n: number;
}

function AllUsersTable(props: allUsersTable_prop): React.JSX.Element {
    const [allUsersTable, setAllUsersTable] = useState<UserProfileDTO[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    function handleNameClick(userId: number) {
        setSelectedUserId(userId);
        setModalIsOpen(true);
    }

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/all_users";
        fetchGetSet(apiUrl, setAllUsersTable);
    }, [props.n]);

    if (allUsersTable.length === 0)
        return (
            <div>
                <br />
                No users. Sadge.
            </div>
        );
    return (
        <div>
            <UserProfileModal
                id={selectedUserId}
                isOpen={modalIsOpen}
                onClose={handleCloseModal}
            />
            <table className="big-table">
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Rank</th>
                        <th>MMR</th>
                        <th>Matches</th>
                        <th>Win Rate</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {allUsersTable.map((element: UserProfileDTO) => (
                        <tr key={element.id}>
                            <td>
                                <button
                                    className="button-as-text"
                                    onClick={() => handleNameClick(element.id)}
                                >
                                    {element.name}
                                </button>
                            </td>
                            <td>{element.rank}</td>
                            <td>{element.mmr}</td>
                            <td>{element.matches}</td>
                            <td>{element.winrate !== null ? element.winrate : "N/A"}</td>
                            <td>{element.online ? "🟢" : "🔴"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllUsersTable;
