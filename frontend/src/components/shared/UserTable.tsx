import React, { useEffect, useState } from "react";
import UserProfileModal from "../UserProfileModal/UserProfileModal";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/buttons.css";
import "src/styles/userTable.css";

interface userTableProp {
    users: UserProfileDTO[];
}

function UserTable(props: userTableProp): React.JSX.Element {
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    function handleNameClick(userId: number) {
        setSelectedUserId(userId);
        setModalIsOpen(true);
    }

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    if (props.users.length === 0)
        return (
            <div>
                <br />
                👻
            </div>
        );
    return (
        <div>
            <UserProfileModal
                id={selectedUserId}
                isOpen={modalIsOpen}
                onClose={handleCloseModal}
            />
            <table className="userTable">
                <thead>
                    <tr>
                        <th></th>
                        <th>Player</th>
                        <th>Rank</th>
                        <th>MMR</th>
                        <th>Matches</th>
                        <th>Win Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {props.users.map((element: UserProfileDTO, index: number) => (
                        <tr key={element.id}>
                            <td>{element.online ? "🟢" : "🔴"}</td>
                            <td>
                                <button
                                    className="textButton"
                                    onClick={() => handleNameClick(element.id)}
                                >
                                    {element.name}
                                </button>
                            </td>
                            <td>{element.rank}</td>
                            <td>{element.mmr}</td>
                            <td>{element.matches}</td>
                            <td>{element.winrate !== null ? element.winrate : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;
