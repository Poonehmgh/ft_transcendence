import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

function Ball(props) {
  const { newRound, gameUpdate } = props;
  const [currentPosition, setCurrentPosition] = useState([50, 75]);
  const [targetPosition, setTargetPosition] = useState([50, 75]);

  useEffect(() => {
    if (newRound) {
      setCurrentPosition([
        0.98 * newRound.PositionBall[0] + 1.5,
        -0.435 * newRound.PositionBall[1] + 95.5,
      ]);
    }
  }, [newRound]);

  useEffect(() => {
    if (gameUpdate) {
      setTargetPosition([
        1 * gameUpdate.ballPosition[0] - 0.4,
        -0.425 * gameUpdate.ballPosition[1] + 94,
      ]);
    }
  }, [gameUpdate]);

  useEffect(() => {
    const updatePosition = () => {
      const ease = 0.1; // Adjust the ease value for smoother or quicker movement
      const dx = targetPosition[0] - currentPosition[0];
      const dy = targetPosition[1] - currentPosition[1];
      const vx = dx * ease;
      const vy = dy * ease;
      setCurrentPosition([currentPosition[0] + vx, currentPosition[1] + vy]);
    };

    const animationFrame = requestAnimationFrame(updatePosition);

    return () => cancelAnimationFrame(animationFrame);
  }, [currentPosition, targetPosition]);

  const ballStyle = {
    left: `${currentPosition[0]}%`,
    top: `${currentPosition[1]}%`,
    width: `2%`,
    height: `4%`,
    borderRadius: "50%",
  };

  return (
    <>
      {newRound ? (
        <div className="ball" style={ballStyle}></div>
      ) : (
        // <div className="ball" style={ballStyle}></div>
        <></>
      )}
    </>
  );
}

export default Ball;
