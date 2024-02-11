import React from "react";

const ScoreV2 = (newRound) => {
	return(
			<span className="score-container">
					<div className="scores">{newRound.ScorePlayer1}    :    {newRound.ScorePlayer2}</div>
			</span>
	);
}

export default ScoreV2;