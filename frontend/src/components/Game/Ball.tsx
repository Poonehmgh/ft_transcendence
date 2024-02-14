import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

// leftX == 1.5
// rightX == 99.5
// lengthX == 98

// lowY == 95.5
// topY == 52
// lengthY == 43.5

function Ball(props) {
  const { newRound, gameUpdate } = props;
  const [ballPosition, setBallPosition] = useState([50, 75]); //BE

  useEffect(() => {
    if (newRound) {      
      const x = newRound.PositionBall[0];
      const y = newRound.PositionBall[1];
      
      setBallPosition([
        0.54 * x + 95.5,
        0.54 * y + 1.5
      ]);

    }
  }, [newRound]);

  useEffect(() => {
    if (gameUpdate) {
      const x2 = gameUpdate.updatedBallPosition[0];
      const y2 = gameUpdate.updatedBallPosition[1];

      setBallPosition([
        0.54 * x2 + 95.5,
        0.54 * y2 + 1.5
      ]);
    }
  }, [gameUpdate]);

  const ballStyle = {
    left: `${ballPosition[0]}%`, //BE
    top: `${ballPosition[1]}%`, //BE
    width: `0.5%`, //BE
    height: `1%`, //BE
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
