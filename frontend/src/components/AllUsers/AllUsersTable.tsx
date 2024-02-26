import React, { useEffect, useState } from "react";
import UserProfileModal from "../UserProfileModal/UserProfileModal_main";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper } from "utils";

// DTO
import { UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/buttons.css";

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
        async function fetchAllUsers() {
            const apiUrl = backendUrl.user + "all_users";
            const data = await fetchWrapper<UserProfileDTO[]>("GET", apiUrl, null);
            setAllUsersTable(data);
        }

        fetchAllUsers();
    }, [props.n]);

    if(!Array.isArray(allUsersTable))
    {
        return(null);
    }

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
            <table>
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
                            <td>
                                {element.online ? "🟢" : "🔴"}
                                {element.inGame ? " 🎮" : ""}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AllUsersTable;
