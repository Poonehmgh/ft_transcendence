import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "src/components/Header/Header_main";
import Leaderboard from "src/components/LeaderBoard/Leaderboard_main";
import AllUsers from "src/components/AllUsers/AllUsers_main";
import Game from "src/components/Game/Game";
import Chat from "src/components/Chat/Chat_main";
import ErrorPage from "src/components/ErrorPage";
import ManageProfile from "src/components/ManageProfile/ManageProfile_main";
import Login from "./Login";

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/leaderboard" Component={Leaderboard} />
                    <Route path="/allusers" Component={AllUsers} />
                    <Route path="/game" Component={Game} />
                    <Route path="/chat" Component={Chat} />
                    <Route path="/userprofile" Component={ManageProfile} />
                    <Route path="/login" Component={Login} />
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
