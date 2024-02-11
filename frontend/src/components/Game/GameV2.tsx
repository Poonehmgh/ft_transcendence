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

      fetchOpponentData();
    };
  }, [opponentID]);

  useEffect(() => {
    socket.on("gameUpdate", (data) => {
      setGameUpdate(data);
      //When game is over - reset to hooks basal states
    });

    return () => {
      socket.off("gameUpdate");
    };
  }, [socket]);

  const sendMessageToServer = () => {
    //Remove later - need to connect after log-in
    socket.emit("connectMessage", { userID: userData.id }); //Remove later
    socket.emit("joinQueue", { userID: userData.id });
  };

  return (
    <div className="game-container">
      <div className="buttons-container">
        <button className="queue-button" onClick={sendMessageToServer}>
          {queueStatus}
        </button>
        <button className="background-button">Change Background</button>
      </div>
      <div className="info-container">
        <div className="info-player-left">
          {isPlayerOne ? (
            <PlayerGameProfile user={userData} />
          ) : (
            <PlayerGameProfile user={opponentData} />
          )}
        </div>
        <div className="game-scores">
          <ScoreV2 newRound={newRound} />
        </div>
        <div className="info-player-right">
          {isPlayerOne ? (
            <PlayerGameProfile user={opponentData} />
          ) : (
            <PlayerGameProfile user={userData} />
          )}
        </div>
      </div>
      <div className="pong-container">
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
        <div className="ball-space">
          <Ball newRound={newRound} gameUpdate={gameUpdate} />
        </div>
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
