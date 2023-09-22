import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import LogIn from "./LogIn.tsx";
import Home from "./Home.tsx";
import Leaderboard from "./Leaderboard.tsx";
import Game from "./Game.tsx";
import Chat from "./Chat.tsx";
import ErrorPage from "./ErrorPage.tsx";

function getUserID(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Simulate an asynchronous operation, e.g., fetching data from an API.
    setTimeout(() => {
      const success = true; // Set this to true for a successful operation, or false for an error.
      // const success = false; // Set this to true for a successful operation, or false for an error.
      if (success) {
        // If the operation was successful, resolve the Promise with a result.
        resolve('UserID');
      } else {
        // If there was an error, reject the Promise with an error message.
        reject(null);
      }
    }, 100); // Simulated delay of 2 seconds
  });
}

async function routeUser(){
  try {
    await getUserID();
    return null;
  } catch (error) {
    return redirect("/");
  }
}

async function routeUserAtLogIn(){
  try {
    await getUserID();
    return redirect("/home");
  } catch (error) {
    return null;
  }
}

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
    ]);

  return <RouterProvider router={router} />;
};

export default Router;