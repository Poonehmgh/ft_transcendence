import React, { CSSProperties, useEffect, useState } from "react";

function UserPlank(props) {
  const { userData, newRound, isPlayerOne, socket } = props;
  const [plankPosition, setPlankPosition] = useState(null);

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
    const handleKeyDown = (e: any) => {
      e.preventDefault();
      switch (e.key) {
        case "ArrowUp":
          if (plankPosition < newRound.fieldHeight - newRound.plankHeight) {
            setPlankPosition(plankPosition + 1);
          }
          break;
        case "ArrowDown":
          if (plankPosition > 0) {
            setPlankPosition(plankPosition - 1);
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
  }, [newRound, plankPosition, socket, userData.id]);

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
          UserPlank
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
export default UserPlank;
