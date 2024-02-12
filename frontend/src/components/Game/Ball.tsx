import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

function Ball(props) {
  const { newRound, gameUpdate} = props;
  const [ballPosition, setBallPosition] = useState(null);
  const [ballStyle, setBallStyle] = useState(null);

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
      });
    }
  }, [ballPosition, newRound]);

  return (
    <>
      {newRound ? (
        <div className="ball" style={ballStyle}>
          Ball
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default Ball;
