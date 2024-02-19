import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

function OpponentPlank(props) {
  const { newRound, gameUpdate, isPlayerOne } = props;
  const [plankPosition, setPlankPosition] = useState(81);
  const plankHeight = "15%";
  const plankWidth = "2.5%";

  useEffect(() => {
    if (newRound) {
      if (isPlayerOne) {
        setPlankPosition(-0.21 * newRound.PositionPlank2 + 81);
      } else {
        setPlankPosition(-0.21 * newRound.PositionPlank1 + 81);
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
    height: plankHeight, //BE - 43 is the full height
    width: plankWidth, //BE - 98 is the full width
  };

  return (
    <>
      {newRound ? (
        <div className="plank" style={plankStyle} />
      ) : (
        // <div className="plank" style={plankStyle} />
        <></>
      )}
    </>
  );
}

export default OpponentPlank;
