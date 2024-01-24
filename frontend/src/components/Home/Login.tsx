import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/fetchers";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";
import "src/styles/buttons.css";

function Login() {
    const [userData, setUserData] = useState(null);
    const loginRedirUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/my_profile";

    useEffect(() => {
        fetchGetSet(apiUrl, setUserData);
    }, [apiUrl]);

    return userData ? null : (
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
