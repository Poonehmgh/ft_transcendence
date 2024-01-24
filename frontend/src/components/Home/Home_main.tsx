import React from "react";
import Login from "./Login";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";

function Home() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";

    function printLocalStorage() {
        console.log(localStorage);
    }

    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">Home</div>
                <Login />
                <button onClick={printLocalStorage}>
                    Print Local Storage
                </button>
            </div>
        </div>
    );
}

export default Home;
