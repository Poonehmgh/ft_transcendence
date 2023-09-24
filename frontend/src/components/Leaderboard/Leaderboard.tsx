import {Link} from "react-router-dom";
import LeaderBoardWolf from "./LeaderBoardTable";
import UserProfile from "../UserProfile/UserProfile";
import SocialActionBar from "../UserProfile/SocialActionBar";
import React from "react";
import '../../styles/leaderboard.css';

function Leaderboard() {
  return (
      <div className="sections-container">
        <div className="section" id="header">
          <div className={"pongers-logo"}>
            <Link className={"link"} to="/home">Pongers</Link><br/>
          </div>
          <ul className={"upper-links"}>
            <li>
              <Link className={"link"} to="/leaderboard">Leaderboard</Link>
            </li>
            <li>
              <Link className={"link"} to="/game">Game</Link>
            </li>
            <li>
              <Link className={"link"} to="/chat">Chat</Link>
            </li>
          </ul>

        </div>
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