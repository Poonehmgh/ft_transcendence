import {Link} from "react-router-dom";
import React from "react";
import '../styles/header.css';
import MyProfileModal from "./MyProfileModal/MyProfileModal";

function Header() {
  return (
      <div className="section" id="header">
        <div className={"pongers-logo"}>
          <Link className={"link"} to="/home">Pongers</Link><br/>
        </div>
        <ul className={"upper-links"}>
          <MyProfileModal id={1}/>
          <li>
            <Link className={"link"} to="/leaderboard">Leaderboard</Link>
          </li>
          <li>
            <Link className={"link"} to="/allusers">All Users</Link>
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