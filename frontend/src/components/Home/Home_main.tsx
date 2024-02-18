import React, { useEffect, useState } from "react";
import Login from "./Login";
import { UserProfileDTO } from "user-dto";
import { fetchWrapper } from "utils";
import backendUrl from "src/constants/backendUrl";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";

function Home() {
    const [userProfile, setUserProfile] = useState<UserProfileDTO>(null);

    useEffect(() => {
        async function fetchUserProfile() {
            const apiUrl = backendUrl.user + "my_profile";
            const data = await fetchWrapper<UserProfileDTO>("GET", apiUrl, null);
            setUserProfile(data);
        }
    }, []);

    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">Home</div>
                {userProfile ? (
                    <div className="h2">{`Welcome, ${userProfile.name}!`}</div>
                ) : (
                    <Login />
                )}
            </div>
        </div>
    );
}

export default Home;
