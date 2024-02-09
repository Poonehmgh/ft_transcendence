import React, { useEffect, useState } from "react";
import Header from "../Header/Header_main";

import { io } from "socket.io-client";
import { authHeader } from "utils";

import "../../styles/game.css";

function GameV2() {


  return (
    <>
      {/* <Header /> */}
      <div className="game-sections-container">
				{/* <button className="queue-button" onClick={sendMessageToServer}>
					{receivedMessage}
				</button> */}
        <div className="player-left-info">{/* <PlayerCardTableV2 /> */}</div>
        <div className="player-right-info">{/* <PlayerCardTableV2 /> */}</div>
        <div className="section game-left-bar">{/* <LeftBarV2 /> */}</div>
        <div className="section game-center">
          <div className="leftBarField"></div>
          <div className="ball">{/* {<Ball/>} */}</div>
          <div className="rightBarField"></div>
        </div>
        <div className="section game-right-bar">{/* <RightBarV2 /> */}</div>
        <div className="section game-score">{/* <ScoreV2 /> */}</div>
      </div>
    </>
  );
}

export default GameV2;
