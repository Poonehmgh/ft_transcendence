import {Link} from "react-router-dom";
import '../styles/style.css';
import React from "react";

function Header() {
  return (
      <div className="section" id="header">
        <div className={"pongers-logo"}>
          <Link className={"link"} to="/home">Pongers</Link><br/>
        </div>
        <ul className={"upper-links"}>
          <li>
            <Link className={"link"} to="/profile">My Profile</Link>
          </li>
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
  );
}

export default Header;