import Header from "./Header";
import React from "react";
import '../styles/game.css'

function Game() {
    return (
        <div className="game-sections-container">
          <Header />
            <div className="section game-left-bar">Left Paddle</div>
            <div className="section game-center">
                <div>Game</div>
            </div>
            <div className="section game-right-bar">Right Bar</div>
            <div className="section game-score">Score</div>
        </div>
    );
}

export default Game;