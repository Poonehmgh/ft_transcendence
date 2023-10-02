import React from "react";
import { fetch_IdAndNameDTO } from "src/ApiCalls/fetchers";
import { IdAndNameDTO } from "user-dto";
import { cancelRequest } from "src/ApiCalls/userActions";
import "src/styles/contactsTable.css";

interface props {
  id: number;
}

let list: IdAndNameDTO[] = [];

function RequestOutList(props: props) {
  function setList(newList: IdAndNameDTO[]) {
    list = newList;
  }

  const getList = async () => {
    try {
      setList(await fetch_IdAndNameDTO(props.id, "request_out"));
    } catch (error) {
      console.error("Error fetching outgoing friend requests:", error);
    }
  };

  getList();

  function handleCancel(id: number, index: number) {
    if (window.confirm(`Cancel friend request to user ${list[index].name}?`)) {
      if (cancelRequest(props.id, list[index].id)) {
        alert("Friend request canceled");
      } else {
        alert("Error canceling friend request");
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
                    onClick={() => handleCancel(entry.id, index)}
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

export default RequestOutList;
