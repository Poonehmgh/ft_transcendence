import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "src/components/Header/Header_main";
import Leaderboard from "src/components/LeaderBoard/Leaderboard_main";
import AllUsers from "src/components/AllUsers/AllUsers_main";
import Game from "src/components/Game/Game";
import Chat from "src/components/Chat/Chat_main";
import ErrorPage from "src/components/App/ErrorPage";
import ManageProfile from "src/components/ManageProfile/ManageProfile_main";
import Home from "../Home/Home_main";
import { getTokenFromCookie, isTokenValid } from "src/functions/utils";

function PongersRoutes() {
    const location = useLocation();
    const token = getTokenFromCookie();
    const validToken = isTokenValid(token);

    const ProtectedRoute = ({ element }) => {
        return validToken ? element : <Navigate to="/home" />;
    };

    return (
        <div>
            <Header location={location} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route
                    path="/leaderboard"
                    element={<ProtectedRoute element={<Leaderboard />} />}
                />
                <Route
                    path="/allusers"
                    element={<ProtectedRoute element={<AllUsers />} />}
                />
                <Route path="/game" element={<ProtectedRoute element={<Game />} />} />
                <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
                <Route
                    path="/userprofile"
                    element={<ProtectedRoute element={<ManageProfile />} />}
                />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </div>
    );
}

export default PongersRoutes;
