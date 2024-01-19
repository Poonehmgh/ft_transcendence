import React, { useEffect, useState } from "react";
import { fetchGet, fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface selectUsersTableProps {
    setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
}

function SelectUsersTable(props: selectUsersTableProps): React.JSX.Element {
    const [users, setUsers] = useState<UserProfileDTO[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    // to do: update the backend when user auth is done to exclude the calling user
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/all_users";

    useEffect(() => {
        fetchGetSet<UserProfileDTO[]>(apiUrl, setUsers);
    }, []);

    function handleUserSelection(userId: number) {
        setSelectedUsers((prevSelectedUsers) => {
            const updatedSelectedUsers = prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter((id) => id !== userId)
                : [...prevSelectedUsers, userId];
            props.setSelectedUsers(updatedSelectedUsers);
            return updatedSelectedUsers;
        });
    }

    return (
        <div>
            {!users || users.length === 0 ? (
                <p>Noone to msg.</p>
            ) : (
                <table className="modalUserList">
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>{user.online ? "🟢" : "🔴"}</td>
                                <td>{user.name}</td>
                                <td style={{ textAlign: "right" }}>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleUserSelection(user.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <br></br>
        </div>
    );
}

export default SelectUsersTable;
