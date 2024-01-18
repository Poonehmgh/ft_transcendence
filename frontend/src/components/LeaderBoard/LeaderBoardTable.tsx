import React, { useEffect, useState } from "react";
import { authContentHeader } from "src/ApiCalls/headers";
import { UserProfileDTO } from "user-dto";
import UserProfileModal from "../UserProfileModal/UserProfileModal";
import { fetchGetSet } from "src/ApiCalls/fetchers";

interface leaderBoardProp {
  n: number;
}

function LeaderBoardTable(props: leaderBoardProp): React.JSX.Element {
  const [leaderTable, setLeaderTable] = useState<UserProfileDTO[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/leaderboard?top=" + props.n;

  function handleNameClick(userId: number) {
    setSelectedUserId(userId);
    setModalIsOpen(true);
  }

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    fetchGetSet(apiUrl, setLeaderTable);
  }, [props.n]);

  if (leaderTable.length === 0)
    return (
      <div>
        <br />
        No matches played.
      </div>
    );
  return (
    <div>
      <UserProfileModal
        id={selectedUserId}
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
      />
      <table className="big-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Rank</th>
            <th>MMR</th>
            <th>Matches</th>
            <th>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {leaderTable.map((element: UserProfileDTO, index: number) => (
            <tr key={element.id}>
              <td>{index + 1}</td>
              <td>
                <button
                  className="button-as-text"
                  onClick={() => handleNameClick(element.id)}
                >
                  {element.online ? "🟢" : "🔴"} {element.name}
                </button>
              </td>
              <td>{element.rank}</td>
              <td>{element.mmr}</td>
              <td>{element.matches}</td>
              <td>{element.winrate !== null ? element.winrate : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeaderBoardTable;
