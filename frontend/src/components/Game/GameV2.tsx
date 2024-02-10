import React, { useEffect, useState } from "react";

import PlayerGameProfile from "./PlayerGameProfile";

import { io } from "socket.io-client";
import { authHeader } from "../../functions/utils";

import "../../styles/game.css";
import backendUrl from "src/constants/backendUrl";

function GameV2() {
  const [userData, setUserData] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [queueStatus, setQueueStatus] = useState("Join Queue");
  const [newRound, setNewRound] = useState(null);
  const [isPlayerOne, setIsPlayerOne] = useState(true);
  const [opponentID, setOpponentID] = useState(null);
  const [gameUpdate, setGameUpdate] = useState(null);

  const myProfileApiUrl = backendUrl.user + "my_profile";
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

  useEffect(() => {
    if (userData) {
        socket.on("newRound", (data) => {
            setNewRound(data);
            if (data.userID1 === userData.id) {
                setIsPlayerOne(true);
                setOpponentID(data.userID2);
            } else if (data.userID2 === userData.id) {
                setIsPlayerOne(false);
                setOpponentID(data.userID1);
            }
        });
    }

    return () => {
        socket.off("newRound");
    };
}, [userData, socket]);


  useEffect(() => {
    const fetchOpponentData = async () => {
      const opponentApiUrl = backendUrl.user + "profile/" + opponentID;
      try {
        const response = await fetch(opponentApiUrl, {
          method: "GET",
          headers: authHeader(),
        });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        setOpponentData(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOpponentData();
  }, [opponentID]);

  useEffect(() => {
    socket.on("gameUpdate", (data) => {
      setGameUpdate(data);
    });

    return () => {
      socket.off("gameUpdate");
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
      <div className="player-left-info">
        <PlayerGameProfile user={userData} />
      </div>
      <div className="player-right-info">
        <PlayerGameProfile user={null} />
      </div>
      <div className="section game-left-bar">{/* <LeftPlank /> */}</div>
      <div className="section game-center">
        <div className="leftBarField"></div>
        <div className="ball">{/* {<Ball/>} */}</div>
        <div className="rightBarField"></div>
      </div>
      <div className="section game-right-bar">{/* <RightPlank /> */}</div>
      <div className="section game-score">{/* <ScoreV2 /> */}</div>
    </div>
  );
}

export default GameV2;
