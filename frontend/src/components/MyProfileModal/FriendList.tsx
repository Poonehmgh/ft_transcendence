import React, { useState } from "react";
import { fetch_IdAndNameDTO } from "src/ApiCalls/fetchers";
import { IdAndNameDTO } from "user-dto";
import { blockUser, removeFriend } from "src/ApiCalls/userActions";
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
      setFriends(await fetch_IdAndNameDTO(props.id, "friends"));
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  getList();

  function handleRemoveFriend(id: number, index: number) {
    if (window.confirm(`Remove friend ${friends[index].name}?`)) {
      if (removeFriend(props.id, friends[index].id)) {
        alert("Friend removed");
      } else {
        alert("Error removing friend");
      }
    }
  }

  function handleSendMsg(id: number) {
    console.log("Mock execute send msg to user with id ", id);
  }

  function handleBlockUser(id: number, index: number) {
    if (window.confirm(`Unfriend and block ${friends[index].name}?`)) {
      if (blockUser(props.id, friends[index].id)) {
        alert("Removed from friends and blocked");
      } else {
        alert("Error unfriending / blocking");
      }
    }
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
