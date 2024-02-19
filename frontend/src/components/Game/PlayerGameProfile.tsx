import React from "react";

import "src/styles/playerCardTable.css";
import "../../styles/gamev2.css";

function PlayerGameProfile(props) {
  const { user, secondUser } = props;

  return (
    <>
      {user && secondUser ? (
        <table className="PlayerGameProfile game-profile">
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
