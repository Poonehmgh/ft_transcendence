import React, { useState } from "react";
import { fetchFriends } from "src/ApiCalls/fetchers";
import { IdAndNameDTO } from "user-dto";

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
      console.log("friendsarray:", friends);
    } catch (error) {
		console.error("Error fetching friends:", error);
    }
};
console.log("friendsarray outsied:", friends);

  getList();

  console.log("id:", props.id);

  function handleRemoveFriend(id: number) {
    console.log(id);
  }

  return (
    <div>
      {!friends || friends.length === 0 ? (
        <p>No friends yet!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((friend) => (
              <tr key={friend.id}>
                <td>{friend.name}</td>
                <td>
                  <button onClick={() => handleRemoveFriend(friend.id)}>
                    Remove Friend
                  </button>
                  <button onClick={() => handleRemoveFriend(friend.id)}>
                    Send Message
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
