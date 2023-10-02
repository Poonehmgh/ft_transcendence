import React, { useState } from "react";
import { fetch_IdAndNameDTO } from "src/ApiCalls/fetchers";
import { IdAndNameDTO } from "user-dto";
import { acceptRequest, declineRequest, removeFriend, unblockUser } from "src/ApiCalls/userActions";
import "src/styles/contactsTable.css";

interface props {
  id: number;
}

let list: IdAndNameDTO[] = [];

function RequestInList(props: props) {
  function setList(newList: IdAndNameDTO[]) {
    list = newList;
  }

  const getList = async () => {
    try {
      setList(await fetch_IdAndNameDTO(props.id, "request_in"));
    } catch (error) {
      console.error("Error fetching incoming friend requests:", error);
    }
  };

  getList();

  function handleDecline(id: number, index: number) {
    if (window.confirm(`Decline friend request from user ${list[index].name}?`)) {
      if (declineRequest(props.id, list[index].id)) {
        alert("Friend request declined");
      } else {
        alert("Error declining friend request");
      }
    }
  }

  function handleAccept(id: number, index: number) {
    if (window.confirm(`Accept friend request from user ${list[index].name}?`)) {
      if (acceptRequest(props.id, list[index].id)) {
        alert("Friend request accepted");
      } else {
        alert("Error accepting friend request");
      }
    }
  }

  return (
    <div>
      {!list || list.length === 0 ? (
        <p>No requests for now!</p>
      ) : (
        <table className="contacts-table">
          <tbody className="contacts-table">
            {list.map((entry, index) => (
              <tr className="contacts-table" key={entry.id}>
                <td className="contacts-table"> {entry.name}</td>
                <td className="contacts-table">
                  <button
                    className="contacts-button"
                    onClick={() => handleAccept(entry.id, index)}
                  >
                    ✅
                  </button>
                  <button
                    className="contacts-button"
                    onClick={() => handleDecline(entry.id, index)}
                  >
                    ❌
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

export default RequestInList;
