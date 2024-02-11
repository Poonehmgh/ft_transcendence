import React, { useEffect, useState } from 'react'

function Ball(newRound, updatedBallPosition) {
	const [ballPosition, setBallPosition] = useState(null);

	useEffect(() => {
		setBallPosition(newRound.PositionBall);
	}, [newRound]);

	useEffect(() => {
		setBallPosition(updatedBallPosition);
	}, [updatedBallPosition]);

	return (
		<div>Ball</div>
	)
}

export default Ball