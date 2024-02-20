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
  const plankHeight = "15%";
  const plankWidth = "2.5%";
  const [plankPosition, setPlankPosition] = useState(81);

  useEffect(() => {
    if (newRound) {
      if (isPlayerOne) {
        setPlankPosition(-28/65 * newRound.PositionPlank2 + 81);
      } else {
        setPlankPosition(-28/65 * newRound.PositionPlank1 + 81);
      }
    }
  }, [isPlayerOne, newRound]);

  useEffect(() => {
    if (userData) {
      const handleKeyDown = (e: any) => {
        e.preventDefault();
        console.log(plankPosition);
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
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [newRound, plankPosition]);

  useEffect(() => {
    if (userData) {
      let position = (65/28) * (81 - plankPosition);
      socket.emit("updatePlank", {
        userID: userData.id,
        plankPosition: position,
      });
    }
  }, [plankPosition, socket]);

  const plankStyle = {
    top: `${plankPosition}%`, //BE
    height: plankHeight, //BE - 43 is the full height
    width: plankWidth, //BE - 98 is the full width
  };

  return (
    <>
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
