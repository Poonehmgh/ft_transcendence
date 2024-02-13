import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

// leftX == 
// rightX == 
// lowY == 
// topY == 
function Ball(props) {
  const { newRound, gameUpdate } = props;
  const [ballPosition, setBallPosition] = useState([75, 75]); //BE

  useEffect(() => {
    if (newRound) {
      setBallPosition(newRound.PositionBall);
    }
  }, [newRound]);

  useEffect(() => {
    if (gameUpdate) {
      setBallPosition(gameUpdate.updatedBallPosition);
    }
  }, [gameUpdate]);

  const ballStyle = {
    left: `${ballPosition[0]}%`,//BE
    top: `${ballPosition[1]}%`,//BE
    width: `5px`,//BE
    height: `5px`,//BE
    borderRadius: "50%",
  };

  return (
    <>
      {newRound ? (
        <div className="ball" style={ballStyle} />
      ) : (
        <div className="ball" style={ballStyle} />
      )}
    </>
  );
}

export default Ball;
