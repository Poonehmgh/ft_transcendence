import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "src/components/Header/Header_main";
import Home from "src/components/Home";
import Leaderboard from "src/components/LeaderBoard/Leaderboard_main";
import AllUsers from "src/components/AllUsers/AllUsers_main";
import Game from "src/components/Game/Game";
import Chat from "src/components/Chat/Chat_main";

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Route path="/home" Component={Home} />
                <Route path="/leaderboard" Component={Leaderboard} />
                <Route path="/allusers" Component={AllUsers} />
                <Route path="/game"Component={Game} />
                <Route path="/chat" Component={Chat} />
            </div>
        </Router>
    );
}

export default App;
