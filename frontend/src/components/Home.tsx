import Header from "./Header";
import React from "react";
import '../styles/home.css'

function Home() {
    return (
    <div className="sections-container">
        <Header />
        <div className="section left-bar">Left Bar</div>
        <div className="section center">
            <div>Hello User</div>
        </div>
        <div className="section right-bar">Right Bar</div>
        <div className="section footer">Footer</div>
    </div>
    );
}

export default Home;