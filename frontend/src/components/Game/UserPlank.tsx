import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

//lowY ==
//topY ==
function UserPlank(props) {
  const { userData, newRound, isPlayerOne, socket } = props;
  const [plankPosition, setPlankPosition] = useState(80); //BE

  useEffect(() => {
    if (newRound) {
      if (isPlayerOne) {
        setPlankPosition(newRound.PositionPlank1);
      } else {
        setPlankPosition(newRound.PositionPlank2);
      }
    }
  }, [isPlayerOne, newRound]);

  useEffect(() => {
    if (userData) {
      const handleKeyDown = (e: any) => {
        e.preventDefault();
        switch (e.key) {
          case "ArrowUp":
            //BE
            if (plankPosition > 53) {
              setPlankPosition(plankPosition - 1);
            }
            break;
          case "ArrowDown":
            //BE
            if (plankPosition < 85) {
              setPlankPosition(plankPosition + 1);
            }
            break;
          default:
            break;
        }
        socket.emit("updatePLank", {
          userID: userData.id,
          plankPosition: plankPosition,
        });
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [newRound, plankPosition, socket, userData]);

  const plankStyle = {
    left: "98.5%",
    top: `${plankPosition}%`, //BE
    height: "15%", //BE
    width: "20px", //BE
  };

  return (
    <>
      {newRound ? (
        <div className="plank" style={plankStyle} />
      ) : (
        <div className="plank" style={plankStyle} />
      )}
    </>
  );
}
export default UserPlank;
