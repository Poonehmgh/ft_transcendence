import React, { useEffect, useState } from "react";
import Login from "./Login";
import { fetchGetSet } from "src/functions/utils";
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";

function Home() {
    const [userData, setUserData] = useState<UserProfileDTO>(null);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/my_profile";

    useEffect(() => {
        fetchGetSet(apiUrl, setUserData);
    }, [apiUrl]);

    if (userData)
        return (
            <div className="mainContainerRow">
                <div className="h2">{`Welcome, ${userData.name}!`}</div>
            </div>
        );

    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">Home</div>
                {userData ? (
                    <div className="h2">{`Welcome, ${userData.name}!`}</div>
                ) : (
                    <Login />
                )}
            </div>
        </div>
    );
}

export default Home;
