import React from "react";

const ScoreV2 = (newRound) => {
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

export default ScoreV2;
