import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "src/components/Header/Header_main";
import Leaderboard from "src/components/LeaderBoard/Leaderboard_main";
import AllUsers from "src/components/AllUsers/AllUsers_main";
import Game from "src/components/Game/Game";
import Chat from "src/components/Chat/Chat_main";
import ErrorPage from "src/components/ErrorPage";
import ManageProfile from "src/components/ManageProfile/ManageProfile_main";
import Home from "./Home/Home_main";
import { getTokenFromCookie, isTokenValid } from "src/functions/utils";

function App() {
    const token = getTokenFromCookie();
    const validToken = isTokenValid(token);

    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    {validToken ? (
                        <>
                            <Route path="/" element={<Home />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route path="/allusers" element={<AllUsers />} />
                            <Route path="/game" element={<Game />} />
                            <Route path="/chat" element={<Chat />} />
                            <Route path="/userprofile" element={<ManageProfile />} />
                            <Route path="*" element={<ErrorPage />} />
                        </>
                    ) : (
                        <Route path="*" element={<Home />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
