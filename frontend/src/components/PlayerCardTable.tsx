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
      <div>
        <table className="playerCard-table">
          <tbody>
            <tr>
              <td className="playerCard-table">mmr</td>
              <td className="playerCard-table">{props.mmr}</td>
            </tr>
            <tr>
              <td className="playerCard-table">rank</td>
              <td className="playerCard-table">{props.rank}</td>
            </tr>
            <tr>
              <td className="playerCard-table">matches</td>
              <td className="playerCard-table">{props.matches}</td>
            </tr>
            <tr>
              <td className="playerCard-table">win rate</td>
              <td className="playerCard-table">{props.winrate ? props.winrate : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PlayerCardTable;
