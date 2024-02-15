import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

// height == 15
// width == 1.5

// totalHeight == 43
// totalWidth == 98

// range == 28

//BE - 43 is the full height
//BE - 98 is the full width

function UserPlank(props) {
  const { userData, newRound, isPlayerOne, socket } = props;
  const [plankPosition, setPlankPosition] = useState(81);

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
    if (userData) {
      const handleKeyDown = (e: any) => {
        e.preventDefault();
        switch (e.key) {
          case "ArrowUp":
            if (plankPosition > 53) {
              setPlankPosition(plankPosition - 1);
            }
            break;
          case "ArrowDown":
            if (plankPosition < 81) {
              setPlankPosition(plankPosition + 1);
            }
            break;
          default:
            break;
        }
        socket.emit("updatePLank", {
          userID: userData.id,
          plankPosition: (plankPosition - 81) / -0.21,
        });
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [newRound, plankPosition, socket, userData]);

  const plankStyle = {
    top: `${plankPosition}%`,
    height: "15%", 
    width: "1.5%",
  };

  return (
    <>
      {/* {console.log("User Plank rendered")}
      {console.log(isPlayerOne)} */}
      {newRound ? (
        <div className="plank" style={plankStyle} />
        ) : (
        // <div className="plank" style={plankStyle} />
        <></>
      )}
    </>
  );
}
export default UserPlank;
