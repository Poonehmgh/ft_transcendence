import React, { useContext } from "react";

// Contexts
import { SocialDataContext } from "src/contexts/SocialDataProvider";

// DTO
import { IdAndNameDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function FriendList() {
    const { friends, removeFriend, blockUser } = useContext(SocialDataContext);

    // will implement this if we have time
    /*   function handleSendMsg(id: number) {
        console.log("Mock execute send msg to user with id ", id);
    } */

    if (friends === null) return <div className="p">Loading data...</div>;
    if (friends.length === 0) return <div className="p">No friends.</div>;

    return (
        <table className="modalUserList">
            <tbody>
                {friends.map((e: IdAndNameDTO) => (
                    <tr key={e.id}>
                        <td>{e.name}</td>
                        <td>
                            {/*   <button
                                className="contactsButton"
                                onClick={() => handleSendMsg(e.id)}
                            >
                                ✉️
                            </button> */}
                            <button
                                className="contactsButton"
                                onClick={() => removeFriend(e.id, e.name)}
                            >
                                ❌
                            </button>
                            <button
                                className="contactsButton"
                                onClick={() => blockUser(e.id, e.name)}
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
