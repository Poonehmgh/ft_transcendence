import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/fetchers";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";
import "src/styles/buttons.css";
import { UserProfileDTO } from "user-dto";

function Login() {
    const [userData, setUserData] = useState<UserProfileDTO>(null);
    const loginRedirUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/my_profile";
    //const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/profile/" + "98525";

    useEffect(() => {
        fetchGetSet(apiUrl, setUserData);
		console.log("useeffect called, userdata:", userData);
    }, [apiUrl]);

    return userData ? "hielo user " + userData.name : (
        <div className="loginContainer">
            <div className="h2">Pls log in!</div>
            <button
                className="bigButton"
                style={{ fontSize: "3rem", padding: "10px 70px" }}
                onClick={() => window.location.assign(loginRedirUrl)}
            >
                🔑
            </button>
        </div>
    );
}

export default Login;
