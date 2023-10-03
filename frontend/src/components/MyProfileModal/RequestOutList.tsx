import React, { useEffect, useState } from "react";
import { fetch_IdAndNameDTO } from "src/ApiCalls/fetchers";
import { cancelRequest } from "src/ApiCalls/userActions";
import "src/styles/contactsTable.css";

interface props {
  id: number;
}

function RequestOutList(props: props) {
  const [group, setGroup] = useState([]);

  useEffect(() => {
    fetchData();
  }, [props.id]);

  async function fetchData() {
    try {
      const data = await fetch_IdAndNameDTO(props.id, "request_out");
      setGroup(data);
    } catch (error) {
      console.error("Error fetching blocked:", error);
    }
  }

  function handleCancel(id: number, index: number) {
    if (window.confirm(`Cancel friend request to user ${group[index].name}?`)) {
      if (cancelRequest(props.id, group[index].id)) {
        alert("Friend request canceled");
        fetchData();
      } else {
        alert("Error canceling friend request");
      }
    }
  }

  return (
    <div>
      {!group || group.length === 0 ? (
        <p>No requests for now!</p>
      ) : (
        <table className="contacts-table">
          <tbody className="contacts-table">
            {group.map((entry, index) => (
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
