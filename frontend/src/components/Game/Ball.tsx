import React, { CSSProperties, useEffect, useState } from "react";

function Ball(newRound, gameUpdate) {
  const [ballPosition, setBallPosition] = useState(null);
  const [ballStyle, setBallStyle] = useState(null);

  useEffect(() => {
    setBallPosition(newRound.PositionBall);
  }, [newRound]);

  useEffect(() => {
    setBallPosition(gameUpdate.updatedBallPosition);
  }, [gameUpdate]);

  useEffect(() => {
    if (newRound && ballPosition) {
      setBallStyle({
        position: "absolute",
        left: `${ballPosition[0]}px`,
        top: `${ballPosition[1]}px`,
        width: `${newRound.ballRadius * 2}px`,
        height: `${newRound.ballRadius * 2}px`,
        borderRadius: "50%",
        backgroundColor: "white",
      })
    }

  }, [ballPosition, newRound]);

  return (
    <>
      {newRound ? (
        <div className="plank" style={ballStyle} >
          Ball
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Ball;
