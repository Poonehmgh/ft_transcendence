import React from "react";


// CSS
import "src/styles/style.css";
import "src/styles/buttons.css";
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
                <div className="loginContainer">
                    <button
                        className="bigButton"
                        style={{ fontSize: "3rem", padding: "20px" }}
                        onClick={AuthComponent}
                    >
                        🔑
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
