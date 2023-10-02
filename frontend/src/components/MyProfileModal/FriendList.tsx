import React, { useState } from "react";
import { fetchFriends } from "src/ApiCalls/fetchers";
import { IdAndNameDTO } from "user-dto";
import "src/styles/contactsTable.css";

interface FriendList_props {
  id: number;
}

let friends: IdAndNameDTO[] = [];

function FriendList(props: FriendList_props) {
  function setFriends(newFriends: IdAndNameDTO[]) {
    friends = newFriends;
  }

  const getList = async () => {
    try {
      setFriends(await fetchFriends(props.id));
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  getList();

  function handleRemoveFriend(id: number, index: number) {
    if (window.confirm(`Remove friend ${friends[index].name}?`)) {
      console.log("Mock execute remove friend ", id);
    }
  }

  function handleSendMsg(id: number) {
    console.log(id);
  }

  function handleBlockUser(id: number) {
    console.log(id);
  }

  return (
    <div>
      {!friends || friends.length === 0 ? (
        <p>No friends yet!</p>
      ) : (
        <table className="contacts-table">
          <tbody className="contacts-table">
            {friends.map((friend, index) => (
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
                    onClick={() => handleBlockUser(friend.id)}
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
