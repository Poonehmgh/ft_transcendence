import React, { useEffect, useState } from "react";
import { fetch_IdAndNameDTO } from "src/ApiCalls/fetchers";
import { unblockUser } from "src/ApiCalls/userActions";
import "src/styles/contactsTable.css";

interface props {
  id: number;
}

function BlockedList(props: props) {
  const [group, setGroup] = useState([]);

  useEffect(() => {
    fetchData();
  }, [props.id]);

  async function fetchData() {
    try {
      const data = await fetch_IdAndNameDTO(props.id, "blocked");
      setGroup(data);
    } catch (error) {
      console.error("Error fetching blocked:", error);
    }
  }

  function handleUnBlockUser(id: number, index: number) {
    if (window.confirm(`Unblock user ${group[index].name}?`)) {
      if (unblockUser(props.id, group[index].id)) {
        alert("User unblocked");
        fetchData();
      } else {
        alert("Error unblocking user");
      }
    }
  }

  return (
    <div>
      {!group || group.length === 0 ? (
        <p>No toxic ppl... yet!</p>
      ) : (
        <table className="contacts-table">
          <tbody className="contacts-table">
            {group.map((entry, index) => (
              <tr className="contacts-table" key={entry.id}>
                <td className="contacts-table"> {entry.name}</td>
                <td className="contacts-table">
                  <button
                    className="contacts-button"
                    onClick={() => handleUnBlockUser(entry.id, index)}
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

export default BlockedList;
