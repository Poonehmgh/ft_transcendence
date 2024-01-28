import React from "react";
import Login from "./Login";

// CSS
import "src/styles/style.css";
import "src/styles/home.css";

function Home() {
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
