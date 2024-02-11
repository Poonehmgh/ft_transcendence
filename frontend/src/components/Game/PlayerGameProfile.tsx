import React from "react";

import "src/styles/playerCardTable.css";

function PlayerGameProfile({ user }) {
  return (
    <>
      {user ? (
        <table className="playerCardTable">
          <tbody>
            <tr>
              <td>name</td>
              <td>{user.name ? user.name : "-"}</td>
            </tr>
            <tr>
              <td>mmr</td>
              <td>{user.mmr ? user.mmr : "-"}</td>
            </tr>
            <tr>
              <td>rank</td>
              <td>{user.rank ? user.rank : "-"}</td>
            </tr>
            <tr>
              <td>matches</td>
              <td>{user.matches ? user.matches : "-"}</td>
            </tr>
            <tr>
              <td>win rate</td>
              <td>{user.winrate ? user.winrate : "-"}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <></>
      )}
    </>
  );
}

export default PlayerGameProfile;
