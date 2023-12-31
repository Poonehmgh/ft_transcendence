import React, { useEffect, useState } from "react";
import { fetch_IdAndNameDTO } from "src/ApiCalls/fetchers";
import { blockUser, removeFriend } from "src/ApiCalls/userActions";
import "src/styles/contactsTable.css";

interface props {
  id: number;
}


function FriendList(props: props) {
  const [group, setGroup] = useState([]);

  useEffect(() => {
    fetchData();
  }, [props.id]);

  async function fetchData() {
    try {
      const data = await fetch_IdAndNameDTO(props.id, "friends");
      setGroup(data);
    } catch (error) {
      console.error("Error fetching blocked:", error);
    }
  }

  function handleRemoveFriend(id: number, index: number) {
    if (window.confirm(`Remove friend ${group[index].name}?`)) {
      if (removeFriend(props.id, group[index].id)) {
        alert("Friend removed");
        fetchData();
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
        fetchData();
      } else {
        alert("Error unfriending / blocking");
      }
    }
  }

  return (
    <div>
      {!group || group.length === 0 ? (
        <p>No friends yet!</p>
      ) : (
        <table className="contacts-table">
          <tbody className="contacts-table">
            {group.map((friend, index) => (
              <tr className="contacts-table" key={friend.id}>
                <td className="contacts-table"> {friend.name}</td>
                <td className="contacts-table">
                  <button
                    className="contacts-button"
                    onClick={() => handleSendMsg(friend.id)}
                  >
                    ✉️
                  </button>
                  <button
                    className="contacts-button"
                    onClick={() => handleRemoveFriend(friend.id, index)}
                  >
                    ❌
                  </button>
                  <button
                    className="contacts-button"
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
