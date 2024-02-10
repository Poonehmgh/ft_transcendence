import React, { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { authHeader } from "../../functions/utils";

import "../../styles/game.css";

function GameV2() {
  const [userData, setUserData] = useState(null);
  const [queueStatus, setQueueStatus] = useState("Join Queue");

  const myProfileApiUrl =
    process.env.REACT_APP_BACKEND_URL + "/user/my_profile";
  const socket = io("localhost:5500");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(myProfileApiUrl, {
          method: "GET",
          headers: authHeader(),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [myProfileApiUrl]);

  useEffect(() => {
    socket.on("queueConfirm", (data) => {
      console.log(data);
      if (data === "Confirmed") {
        setQueueStatus("In Queue");
      } else if (data === "InvalidID") {
        setQueueStatus("Invalid ID");
      } else if (data === "Already in queue") {
        setQueueStatus("Already In Queue");
      } else if (data === "Already in game") {
        setQueueStatus("Already In Game");
      }
    });

    return () => {
      socket.off("queueConfirm");
    };
  }, [socket]);

  const sendMessageToServer = () => {
    socket.emit("connectMessage", { userID: userData.id }); //Remove later
    socket.emit("joinQueue", { userID: userData.id });
  };

  return (
    <div className="game-sections-container">
      <button className="queue-button" onClick={sendMessageToServer}>
        {queueStatus}
      </button>
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
  );
}

export default GameV2;
