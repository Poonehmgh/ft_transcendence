import React from "react";
import Login from "./Login";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";

function Home() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";

    function AuthComponent() {
        try {
            window.location.assign(apiUrl);
        } catch (e) {
            alert(e);
        }
    }

    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">Home</div>
                <Login />
            </div>
        </div>
    );
}

export default Home;
