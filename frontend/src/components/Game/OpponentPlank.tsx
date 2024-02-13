import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

function OpponentPlank(props) {
  const { newRound, gameUpdate, isPlayerOne } = props;
  const [plankPosition, setPlankPosition] = useState(80); //BE

  useEffect(() => {
    if (newRound) {
      if (isPlayerOne) {
        setPlankPosition(newRound.PositionPlank2);
      } else {
        setPlankPosition(newRound.PositionPlank1);
      }
    }
  }, [isPlayerOne, newRound]);

  useEffect(() => {
    if (gameUpdate) {
      setPlankPosition(gameUpdate.enemyPlankPosition);
    }
  }, [gameUpdate]);

  const plankStyle = {
    top: `${plankPosition}%`, //BE
    height: "150px", //BE
    width: "20px", //BE
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
