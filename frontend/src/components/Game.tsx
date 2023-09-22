import {Link} from "react-router-dom";

function Game() {
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
            <div className="section" id="right-bar">Right Bar</div>
            <div className="section" id="center">
                <div>Game</div>
            </div>
            <div className="section" id="left-bar">Left Bar</div>
            <div className="section" id="footer">Footer</div>
        </div>
    );
}

export default Game;