import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import LogIn from "./LogIn";
import Home from "./Home";
import Leaderboard from "./Leaderboard";
import Game from "./Game/Game";
import Chat from "./Chat";
import ErrorPage from "./ErrorPage";
import React from "react";
import { routeUser, routeUserAtLogIn } from "../functions/getUserID";
import Players from "./AllUsers";
import AllUsers from "./AllUsers";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LogIn />,
      loader: routeUserAtLogIn,
      errorElement: <ErrorPage />,
    },
    {
      path: "/home",
      element: <Home />,
      loader: routeUser,
    },
    {
      path: "/leaderboard",
      element: <Leaderboard />,
      loader: routeUser,
    },
    {
      path: "/game",
      element: <Game />,
      loader: routeUser,
    },
    {
      path: "/chat",
      element: <Chat />,
      loader: routeUser,
    },
    {
      path: "/allusers",
      element: <AllUsers />,
      loader: routeUser,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
