import Header from "../Header/Header_main";
import React from "react";
import "../../styles/game.css";
import MoveBall from "./MoveBall";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import Score from "./ScorePlayers";

function Game() {
  return (
    <div className="game-sections-container">
      <div className="section game-left-bar">
        <LeftBar />
      </div>
      <div className="section game-center">
        <div className="leftBarField"></div>
        <div className="ball"></div>
        <MoveBall />
      </div>
      <RightBar />
      <div className="section game-right-bar"></div>
      <div className="section game-score">
        <Score />
      </div>
    </div>
  );
}

export default Game;
