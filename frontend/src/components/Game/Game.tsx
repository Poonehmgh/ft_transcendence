import Header from "../Header";
import React from "react";
import '../../styles/game.css'
import MoveBall from "./MoveBall";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import Score from "./ScorePlayers";
import PlayButton from "./PlayButton";
import PlayerCardTable from "../PlayerCardTable";

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

function Game() {
    return (
        <div className="game-sections-container">
          <PlayButton />
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
            <MoveBall />
            </div>
            <RightBar />
            <div className="section game-right-bar">
            </div>
            <div className="section game-score">
                <Score />
            </div>
        </div>
    );
}

export default Game;