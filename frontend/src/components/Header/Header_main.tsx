import { Link } from "react-router-dom";
import React from "react";
import MyProfileModal from "../MyProfileModal/MyProfileModal";

// CSS
import "src/styles/header.css";
import "src/styles/buttons.css";

function Header() {
    return (
        <div>
            <Link to="/home">
                <img className="pongersLogo" src="/images/wordart.png" alt="pongers" />
            </Link>
            <div className="headerMainContainer">
                <div className="headerTabsContainer">
                    <MyProfileModal id={0} />
                    <Link className="headerTabLink" to="/leaderboard">
                        🏆
                    </Link>
                    <Link className={"link"} to="/allusers">
                        👥
                    </Link>
                    <Link className={"link"} to="/game">
                        🎮
                    </Link>
                    <Link className={"link"} to="/chat">
                        💬
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
