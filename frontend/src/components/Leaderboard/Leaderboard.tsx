import {Link} from "react-router-dom";
import LeaderBoardWolf from "./LeaderBoardTable";
import UserProfile from "../UserProfile/UserProfile";
import SocialActionBar from "../UserProfile/SocialActionBar";
import React from "react";
import '../../styles/leaderboard.css';
import Header from "../Header";

function Leaderboard() {
  return (
      <div className="sections-container">
        <Header />
        <div className="section" id="center">
          <div>
            <h2>Leaderboard</h2>
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>MMR</th>
                <th>Matches</th>
                <th>Win Rate</th>
              </tr>
              </thead>
              <LeaderBoardWolf n = {5} />
            </table>
          </div>
        </div>
      </div>
  );
}

export default Leaderboard;