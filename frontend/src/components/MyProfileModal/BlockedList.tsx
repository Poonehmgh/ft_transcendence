import React, { useState } from "react";
import { fetch_IdAndNameDTO } from "src/ApiCalls/fetchers";
import { IdAndNameDTO } from "user-dto";
import { removeFriend, unblockUser } from "src/ApiCalls/userActions";
import "src/styles/contactsTable.css";

interface props {
  id: number;
}

let blocked: IdAndNameDTO[] = [];

function BlockedList(props: props) {
  function setBlocked(newBlocked: IdAndNameDTO[]) {
    blocked = newBlocked;
  }

  const getList = async () => {
    try {
      setBlocked(await fetch_IdAndNameDTO(props.id, "blocked"));
    } catch (error) {
      console.error("Error fetching blocked:", error);
    }
  };

  getList();

  function handleUnBlockUser(id: number, index: number) {
    if (window.confirm(`Unblock user ${blocked[index].name}?`)) {
      if (unblockUser(props.id, blocked[index].id)) {
        alert("User unblocked");
      } else {
        alert("Error unblocking user");
      }
    }
  }

  return (
    <div>
      {!blocked || blocked.length === 0 ? (
        <p>No toxic ppl (yet)!</p>
      ) : (
        <table className="contacts-table">
          <tbody className="contacts-table">
            {blocked.map((entry, index) => (
              <tr className="contacts-table" key={entry.id}>
                <td className="contacts-table"> {entry.name}</td>
                <td className="contacts-table">
                  <button
                    className="contacts-button-unblock"
                    onClick={() => handleUnBlockUser(entry.id, index)}
                  >
                    🕊️
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

export default BlockedList;
