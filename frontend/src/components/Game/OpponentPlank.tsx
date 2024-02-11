import React, { CSSProperties, useEffect, useState } from "react";

function OpponentPlank(props) {
  const { newRound, gameUpdate, isPlayerOne } = props;
  const [plankPosition, setPlankPosition] = useState(null);

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
    setPlankPosition(gameUpdate.enemyPlankPosition);
  }, [gameUpdate]);

  const plankStyle: CSSProperties = {
    position: "absolute",
    top: `${plankPosition}px`,
    width: `${newRound.plankWidth}px`,
    height: `${newRound.plankHeight}px`,
    backgroundColor: "white",
  };

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
