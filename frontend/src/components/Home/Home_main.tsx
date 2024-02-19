import React, { useContext, useEffect, useState } from "react";
import Login from "./Login";
import { fetchWrapper } from "src/functions/utils";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { AuthContext } from "src/contexts/AuthProvider";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";

function Home() {
    const { validToken } = useContext(AuthContext);
    const [userProfile, setUserProfile] = useState<UserProfileDTO>(null);

    useEffect(() => {
        async function fetchUserProfile() {
            const apiUrl = backendUrl.user + "my_profile";
            const data = await fetchWrapper<UserProfileDTO>("GET", apiUrl, null);
            setUserProfile(data);
        }

        fetchUserProfile();
    }, []);

    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">Home</div>
                {validToken ? (
                    <div className="h2">{`Welcome, ${userProfile?.name || "Loading data..."}!`}</div>
                ) : (
                    <Login />
                )}
            </div>
        </div>
    );
}

export default Home;
