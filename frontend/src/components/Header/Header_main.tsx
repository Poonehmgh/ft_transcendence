import { Link } from "react-router-dom";
import React from "react";

// CSS
import "src/styles/header.css";
import "src/styles/buttons.css";

function Header({location}) {

    return (
        <div>
            <Link className="homeLinkClickArea" to="/home" />
            <div className="headerMainContainer">
                <img className="pongersLogo" src="/images/wordart.png" alt="pongers" />
                <div className="headerTabsContainer">
                    <Link
                        className={
                            location.pathname === "/game"
                                ? "headerTabLinkSelected"
                                : "headerTabLink"
                        }
                        to="/game"
                    >
                        🎮
                    </Link>
                    <Link
                        className={
                            location.pathname === "/leaderboard"
                                ? "headerTabLinkSelected"
                                : "headerTabLink"
                        }
                        to="/leaderboard"
                    >
                        🏆
                    </Link>
                    <Link
                        className={
                            location.pathname === "/allusers"
                                ? "headerTabLinkSelected"
                                : "headerTabLink"
                        }
                        to="/allusers"
                    >
                        👥
                    </Link>
                    <Link
                        className={
                            location.pathname === "/chat"
                                ? "headerTabLinkSelected"
                                : "headerTabLink"
                        }
                        to="/chat"
                    >
                        💬
                    </Link>
                    <Link
                        className={
                            location.pathname === "/userprofile"
                                ? "headerTabLinkSelected"
                                : "headerTabLink"
                        }
                        to="/userprofile"
                    >
                        👤
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
