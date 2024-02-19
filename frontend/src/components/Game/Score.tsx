import React from "react";
import "../../styles/gamev2.css";

const Score = (props) => {
  const { newRound } = props;
  return (
    <>
      {newRound ? (
        <div className="scores">
          {newRound.ScorePlayer1} : {newRound.ScorePlayer2}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Score;
