import React from "react";
import Header from "../Header";
import LeaderBoardTable from "./LeaderBoardTable";
import '../../styles/leaderboard.css';

function Leaderboard() {
  return (
      <div className="sections-container">
        <Header />
        <div className="section center">
          <div>
            <h2>Leaderboard</h2>
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Rank</th>
                <th>MMR</th>
                <th>Matches</th>
                <th>Win Rate</th>
              </tr>
              </thead>
              <LeaderBoardTable n = {5} />
            </table>
          </div>
        </div>
      </div>
  );
}

export default Leaderboard;
