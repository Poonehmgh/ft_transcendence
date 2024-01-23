import React from "react";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";
import "src/styles/buttons.css";

function Login() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";

    function authComponent() {
        try {
            window.location.assign(apiUrl);
        } catch (e) {
            alert(e);
        }
    }

    return (
        <div className="loginContainer">
            <button
                className="bigButton"
                style={{ fontSize: "3rem", padding: "10px 70px"}}
                onClick={authComponent}
            >
                🔑
            </button>
        </div>
    );
}

export default Login;
