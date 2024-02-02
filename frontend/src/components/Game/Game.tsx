import Header from "../Header/Header_main";
import React from "react";
import '../../styles/game.css'
// import MoveBall from "./MoveBall";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import Score from "./ScorePlayers";
import PlayButton from "./PlayButton";
import PlayerCardTable from "../shared/PlayerCardTable";

const playerData1 = {
    mmr: 4000,
    rank: "Guardian II",
    matches: 100,
    winrate: 0.65,
  };

  const playerData2 = {
    mmr: 3900,
    rank: "Guardian III",
    matches: 500,
    winrate: 0.9,
  };

  const one = 1; //change
  const two = 0; // change

function Game() {
    return (
        <div className="game-sections-container">
          {/* <PlayButton /> */}
          <PlayButton/>
          <div className="player-left-info">
            <PlayerCardTable mmr={playerData1.mmr} rank={playerData1.rank} matches={playerData1.matches} winrate={playerData1.winrate}/>
          </div>
          <div className="player-right-info">
            <PlayerCardTable mmr={playerData2.mmr} rank={playerData2.rank} matches={playerData2.matches} winrate={playerData2.winrate} />
          </div>
          <Header />
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