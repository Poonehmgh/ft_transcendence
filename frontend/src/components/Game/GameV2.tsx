import React, { useEffect, useState } from "react";

import PlayerGameProfile from "./PlayerGameProfile";
import ScoreV2 from "./ScoreV2";
import UserPlank from "./UserPlank";
import OpponentPlank from "./OpponentPlank";
import Ball from "./Ball";

import { io } from "socket.io-client";
import { authHeader } from "../../functions/utils";

import backendUrl from "src/constants/backendUrl";

import "../../styles/gamev2.css";

function GameV2() {
  const [userData, setUserData] = useState(null);
  const [opponentID, setOpponentID] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [queueStatus, setQueueStatus] = useState("Join Queue");
  const [newRound, setNewRound] = useState(null);
  const [isPlayerOne, setIsPlayerOne] = useState(null);
  const [gameUpdate, setGameUpdate] = useState(null);
  // const [gameResult, setGameResult] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("default-color");
  const [infoContainerClass, setInfoContainerClass] = useState(
    "info-container default-color"
  );
  const [pongContainerClass, setPongContainerClass] = useState(
    "pong-container default-color"
  );

  const socket = io("localhost:5500");

  useEffect(() => {
    const fetchUserData = async () => {
      const myProfileApiUrl = backendUrl.user + "my_profile";
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
  }, []);

  useEffect(() => {
    const handleQueue = (data) => {
      if (data === "Confirmed") {
        setQueueStatus("In Queue");
      } else if (data === "InvalidID") {
        setQueueStatus("Invalid ID");
      } else if (data === "Already in queue") {
        setQueueStatus("Already In Queue");
      } else if (data === "Already in game") {
        setQueueStatus("Already In Game");
      }
    };

    socket.on("queueConfirm", handleQueue);

    return () => {
      socket.off("queueConfirm", handleQueue);
    };
  }, [socket]);

  useEffect(() => {
    const handleNewRound = (data) => {
      if (userData) {
        setNewRound(data);
        setQueueStatus("Playing");
        console.log(data);
        if (isPlayerOne === null) {
          if (data.userID1 === userData.id) {
            setIsPlayerOne(true);
            setOpponentID(data.userID2);
          } else if (data.userID2 === userData.id) {
            setIsPlayerOne(false);
            setOpponentID(data.userID1);
          }
        }
      }
    };

    socket.on("newRound", handleNewRound);

    return () => {
      socket.off("newRound", handleNewRound);
    };
  }, [userData, socket, isPlayerOne]);

  useEffect(() => {
    const fetchOpponentData = async () => {
      if (opponentID) {
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
      }
    };
    fetchOpponentData();
  }, [opponentID]);

  useEffect(() => {
    const handleGameUpdate = (data) => {
      setGameUpdate(data);
    }
    
    socket.on("gameUpdate", handleGameUpdate)

    return () => {
      socket.off("gameUpdate", handleGameUpdate);
    };
  }, [socket]);

  const resetHooks = () => {
    setUserData(null);
    setOpponentID(null);
    setOpponentData(null);
    setQueueStatus("Join Queue");
    setNewRound(null);
    setIsPlayerOne(null);
    setGameUpdate(null);
    // setGameResult(null);
  };

  useEffect(() => {
    const handleGameResult = () => {
      resetHooks();
    } 

    socket.on("gameResult", handleGameResult);

    return () => {
      socket.off("gameResult", handleGameResult);
    };
  }, [socket]);

  const sendMessageToServer = () => {
    //Remove later - need to connect after log-in
    socket.emit("connectMessage", { userID: userData.id }); //Remove later
    socket.emit("joinQueue", { userID: userData.id });
  };

  const changeBackground = () => {
    setBackgroundColor(
      backgroundColor === "default-color"
        ? "alternative-color"
        : "default-color"
    );

    setInfoContainerClass("info-container " + backgroundColor);
    setPongContainerClass("pong-container " + backgroundColor);
  };

  return (
    <div className="game-container">
      <div className="buttons-container">
        <button className="game-button" onClick={sendMessageToServer}>
          {queueStatus}
        </button>
        <button className="game-button" onClick={changeBackground}>
          Change Background
        </button>
      </div>
      <div className={infoContainerClass}>
        <div className="info-player-left">
          {isPlayerOne ? (
            <PlayerGameProfile user={userData} secondUser={opponentData} />
          ) : (
            <PlayerGameProfile user={opponentData} secondUser={userData} />
          )}
        </div>
        <div className="info-scores">
          <ScoreV2 newRound={newRound} />
        </div>
        <div className="info-player-right">
          {isPlayerOne ? (
            <PlayerGameProfile user={opponentData} secondUser={userData} />
          ) : (
            <PlayerGameProfile user={userData} secondUser={opponentData} />
          )}
        </div>
      </div>
      <div className={pongContainerClass}>
        <div className="left-plank">
          {isPlayerOne ? (
            <UserPlank
              userData={userData}
              newRound={newRound}
              isPlayerOne={isPlayerOne}
              socket={socket}
            />
          ) : (
            <OpponentPlank
              newRound={newRound}
              gameUpdate={gameUpdate}
              isPlayerOne={isPlayerOne}
            />
          )}
        </div>
        <Ball newRound={newRound} gameUpdate={gameUpdate} />
        <div className="right-plank">
          {isPlayerOne ? (
            <OpponentPlank
              newRound={newRound}
              gameUpdate={gameUpdate}
              isPlayerOne={isPlayerOne}
            />
          ) : (
            <UserPlank
              userData={userData}
              newRound={newRound}
              isPlayerOne={isPlayerOne}
              socket={socket}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default GameV2;
