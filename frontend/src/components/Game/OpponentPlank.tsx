import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

function OpponentPlank(props) {
  const { newRound, gameUpdate, isPlayerOne } = props;
  const [plankPosition, setPlankPosition] = useState(81); //BE

  useEffect(() => {
    if (newRound) {
      if (isPlayerOne) {
        setPlankPosition(-0.21 * newRound.PoPositionPlank2 + 81);
      } else {
        setPlankPosition(-0.21 * newRound.PoPositionPlank1 + 81);
      }
    }
  }, [isPlayerOne, newRound]);

  useEffect(() => {
    if (gameUpdate) {
      setPlankPosition(-0.21 * gameUpdate.enemyPlankPosition + 81);
    }
  }, [gameUpdate]);

  const plankStyle = {
    top: `${plankPosition}%`, //BE
    height: "15%", //BE - 43 is the full height
    width: "1.5%", //BE - 98 is the full width
  };

  return (
    <>
      {newRound ? (
        <div className="plank" style={plankStyle} />
      ) : (
        <div className="plank" style={plankStyle} />
      )}
    </>
  );
}

export default OpponentPlank;
