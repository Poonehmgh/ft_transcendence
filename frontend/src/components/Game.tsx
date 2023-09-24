import Header from "./Header";
import React from "react";
import '../styles/style.css'

function Game() {
    return (
        <div className="sections-container">
          <Header />
            <div className="section left-bar">Left Bar</div>
            <div className="section center">
                <div>Game</div>
            </div>
            <div className="section right-bar">Right Bar</div>
            <div className="section footer">Footer</div>
        </div>
    );
}

export default Game;