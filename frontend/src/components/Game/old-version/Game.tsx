import Header from "../../Header/Header_main";
import React from "react";
import '../../styles/game.css'
// import MoveBall from "./MoveBall";
import axios from "axios";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import Score from "./ScorePlayers";
import {useState, useEffect} from "react";
import { authHeader } from "../../../functions/utils";
import { fetchGetSet } from "../../../functions/utils";
// import PlayButton from "./PlayButton";
import { UserProfileDTO } from "src/dto/user-dto";
import PlayerCardTable from "../../shared/PlayerCardTable";

  const playerData2 = {
    mmr: 3900,
    rank: "Guardian III",
    matches: 500,
    winrate: 0.9,
  };
  
  const one = 1; //change
  const two = 0; // change
  
  function Game() {
    
  const apiUrl_profile = process.env.REACT_APP_BACKEND_URL + "/user/my_profile";
  const apiUrl_oponent_profile = process.env.REACT_APP_BACKEND_URL + "/user/my_profile";
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(apiUrl_profile, {
          method: 'GET',
          headers: 
            authHeader(),
        });
  
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
  
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error);
      }
    };
    fetchUserData();
  }, []); 
    return (
        <div className="game-sections-container">
          {/* <PlayButton /> */}
          {/* <PlayButton/> */}
          <div className="player-left-info">
          {userData ? (
            <PlayerCardTable
              mmr={userData.mmr}
              rank={userData.rank}
              matches={userData.matches}
              winrate={userData.winrate}
            />
          ) : ( <p>Loading user data...</p> )} {/* this is implemented, this is players info*/}
          </div>
          <div className="player-right-info">
            <PlayerCardTable mmr={playerData2.mmr} rank={playerData2.rank} matches={playerData2.matches} winrate={playerData2.winrate} /> {/* this has to be oponents info*/}
          </div>
            <div className="section game-left-bar">
                <LeftBar />
            </div>
            <div className="section game-center">
            <div className="leftBarField">
            </div>
            <div className="ball"></div>
            {/* <MoveBall /> */}
            </div>
            <RightBar />
            <div className="section game-right-bar">
            </div>
            <div className="section game-score">
                <Score scorePlayerOne={one} scorePlayerTwo={two}/>
            </div>
        </div>
    );
}

export default Game;