import React, { useEffect, useState } from "react";
import "../../styles/gamev2.css";

function GameOutcome(props) {
  const { gameResult } = props;
  
  return (
    <>
			{gameResult ? (
        gameResult === "Victory" ? (
          <div className="outcome-window victory-window">
						<p className="outcome-text">{gameResult}</p>
					</div>
        ) : (
          <div className="outcome-window defeat-window">
						<p className="outcome-text">{gameResult}</p>
					</div>
        )
      ) : (
        <div className="outcome-window">
						<p className="outcome-text">- - -</p>
					</div>
      )}
    </>
  );
}

export default GameOutcome;
