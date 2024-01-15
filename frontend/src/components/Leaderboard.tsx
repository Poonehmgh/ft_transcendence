import React from "react";
import Header from "./Header";
import LeaderBoardTable from "./LeaderBoardTable/LeaderBoardTable";
import '../styles/tableElement.css';

function Leaderboard() {
  return (
      <div className="sections-container">
        <Header />
        <div className="table-center">
          <div>
            <h2>Leaderboard</h2>
			<LeaderBoardTable n = {5} />
          </div>
        </div>
      </div>
  );
}

export default Leaderboard;
