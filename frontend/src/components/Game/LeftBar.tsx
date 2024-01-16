import React, { useEffect, useState } from "react";
import "../../styles/game.css";

const LeftBar = () => {
  const [topPosition, setTopPosition] = useState(50); // Initial top position

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowUp":
          if (topPosition > 46) {
            setTopPosition(topPosition - 1); // Adjust the step size as needed
          }
          break;
        case "ArrowDown":
          if (topPosition < 81) {
            setTopPosition(topPosition + 1); // Adjust the step size as needed
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [topPosition]);

  const barStyle = {
    top: `${topPosition}%`, // Set the top position based on state
  };

  return (
    <div>
      <div className="left-bar" style={barStyle} />
    </div>
  );
};

export default LeftBar;
