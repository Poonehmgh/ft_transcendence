import React from "react";

const ScoreV2 = (newRound) => {
	return(
			<span className="baza">
					<div className="score-player">{newRound.ScorePlayer1}    :    {newRound.ScorePlayer2}</div>
			</span>
	);
}

export default ScoreV2;