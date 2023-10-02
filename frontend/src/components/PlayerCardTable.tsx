import React from "react";
import "src/styles/playerCardTable.css";

interface PlayerCardTable_prop {
  mmr: number;
  rank: string;
  matches: number;
  winrate: number;
}

function PlayerCardTable(props: PlayerCardTable_prop) {
  return (
    <div>
      <div className="modal-table-div">
        <table className="modal-table">
          <tbody>
            <tr>
              <td className="modal-table">mmr</td>
              <td className="modal-table">{props.mmr}</td>
            </tr>
            <tr>
              <td className="modal-table">rank</td>
              <td className="modal-table">{props.rank}</td>
            </tr>
            <tr>
              <td className="modal-table">matches</td>
              <td className="modal-table">{props.matches}</td>
            </tr>
            <tr>
              <td className="modal-table">win rate</td>
              <td className="modal-table">{props.winrate ? props.winrate : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlayerCardTable;
