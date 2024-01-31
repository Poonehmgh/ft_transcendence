import React, { useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import Loading_h2 from "src/components/shared/Loading_h2";

// DTO
import { UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";
import "src/styles/buttons.css";

function Login() {
    const loginRedirUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";

    return (
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
