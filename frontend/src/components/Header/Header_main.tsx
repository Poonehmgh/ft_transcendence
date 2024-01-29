import { Link } from "react-router-dom";
import React from "react";

// CSS
import "src/styles/header.css";
import "src/styles/buttons.css";

function Header() {
    return (
        <div>
            <Link className="homeLinkClickArea" to="/home" />
            <div className="headerMainContainer">
                <img className="pongersLogo" src="/images/wordart.png" alt="pongers" />
                <div className="headerTabsContainer">
                    <Link className="headerTabLink" to="/game">
                        🎮
                    </Link>
                    <Link className="headerTabLink" to="/leaderboard">
                        🏆
                    </Link>
                    <Link className="headerTabLink" to="/allusers">
                        👥
                    </Link>
                    <Link className="headerTabLink" to="/chat">
                        💬
                    </Link>
                    <Link className="headerTabLink" to="/userprofile">
                        👤
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
