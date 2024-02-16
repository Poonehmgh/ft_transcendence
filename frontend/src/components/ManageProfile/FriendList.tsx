import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import { handleBlockUser, handleRemoveFriend } from "src/functions/userActions";
import backendUrl from "src/constants/backendUrl";

// DTO
import { IdAndNameDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function FriendList() {
    const [group, setGroup] = useState(null);
    const apiUrl = backendUrl.user + "friends";

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function doRemoveFriend(id: number, name: string) {
        handleRemoveFriend(id, name);
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }

    function doRemoveAndBlockFriend(id: number, name: string) {
        handleBlockUser(id, name);
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }

    function handleSendMsg(id: number) {
        console.log("Mock execute send msg to user with id ", id);
    }

    if (!group) return <div className="p">Loading data...</div>;
    if (group.length === 0) return <div className="p">No friends.</div>;

    return (
        <table className="modalUserList">
            <tbody>
                {group.map((element, index) => (
                    <tr key={index}>
                        <td>{element.name}</td>
                        <td>
                            <button
                                className="contactsButton"
                                onClick={() => handleSendMsg(element.id)}
                            >
                                ✉️
                            </button>
                            <button
                                className="contactsButton"
                                onClick={() => doRemoveFriend(element.id, element.name)}
                            >
                                ❌
                            </button>
                            <button
                                className="contactsButton"
                                onClick={() =>
                                    doRemoveAndBlockFriend(element.id, element.name)
                                }
                            >
                                🚫
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default FriendList;
