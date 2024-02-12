import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

function OpponentPlank(props) {
  const { newRound, gameUpdate, isPlayerOne } = props;
  const [plankPosition, setPlankPosition] = useState(null);
  const [plankStyle, setPlankStyle] = useState(null);

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

  useEffect(() => {
    if (newRound && plankPosition) {
      setPlankStyle({
        position: "absolute",
        top: `${plankPosition}px`,
        width: `${newRound.plankWidth}px`,
        height: `${newRound.plankHeight}px`,
        backgroundColor: "white",
      })
    }

  }, [plankPosition, newRound]);

  return (
    <>
      {newRound ? (
        <div className="plank" style={plankStyle}>
          OpponentPlank
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default OpponentPlank;
