import React, { useEffect, useState } from 'react'

function Ball(newRound, gameUpdate) {
	const [ballPosition, setBallPosition] = useState(null);

	useEffect(() => {
		setBallPosition(newRound.PositionBall);
	}, [newRound]);

	useEffect(() => {
		setBallPosition(gameUpdate.updatedBallPosition);
	}, [gameUpdate]);

	return (
		<>
			{ballPosition ? (
				<div>Ball</div>
			):(
				<></>
			)}
		</>
	)
}

export default Ball