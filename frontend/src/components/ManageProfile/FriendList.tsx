import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { blockUser, removeFriend } from "src/ApiCalls/userActions";

// DTO
import { IdAndNameDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

interface friendListProps {
    id: number;
}

function FriendList(props: friendListProps) {
    const [group, setGroup] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/friends/" + props.id;

    useEffect(() => {
        fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
    }, [apiUrl]);

    function handleRemoveFriend(id: number, index: number) {
        if (window.confirm(`Remove friend ${group[index].name}?`)) {
            if (removeFriend(props.id, group[index].id)) {
                alert("Friend removed");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error removing friend");
            }
        }
    }

    function handleSendMsg(id: number) {
        console.log("Mock execute send msg to user with id ", id);
    }

    function handleBlockUser(id: number, index: number) {
        if (window.confirm(`Unfriend and block ${group[index].name}?`)) {
            if (blockUser(props.id, group[index].id)) {
                alert("Removed from friends and blocked");
                fetchGetSet<IdAndNameDTO[]>(apiUrl, setGroup);
            } else {
                alert("Error unfriending / blocking");
            }
        }
    }

    return (
        <div>
            {!group || group.length === 0 ? (
                <div className="p">No friends. Don't be shy!</div>
            ) : (
                <table className="modalUserList">
                    <tbody>
                        {group.map((friend, index) => (
                            <tr key={friend.id}>
                                <td>{friend.name}</td>
                                <td>
                                    <button
                                        className="contactsButton"
                                        onClick={() => handleSendMsg(friend.id)}
                                    >
                                        ✉️
                                    </button>
                                    <button
                                        className="contactsButton"
                                        onClick={() =>
                                            handleRemoveFriend(friend.id, index)
                                        }
                                    >
                                        ❌
                                    </button>
                                    <button
                                        className="contactsButton"
                                        onClick={() => handleBlockUser(friend.id, index)}
                                    >
                                        ⛔
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

export default FriendList;
