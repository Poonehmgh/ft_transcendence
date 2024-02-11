import React, { useEffect, useState } from 'react'

function OpponentPlank(props) {
	const { newRound, gameUpdate, isPlayerOne } = props;
	const [plankPosition, setPlankPosition] = useState(null)

	useEffect(() => {
		if (newRound) {
			if (isPlayerOne) {
				setPlankPosition(newRound.PositionPlank2)
			} else {
				setPlankPosition(newRound.PositionPlank1)
			}
		}
	}, [isPlayerOne, newRound]);

	useEffect(() => {
		setPlankPosition(gameUpdate.enemyPlankPosition);
	}, [gameUpdate]);

	return (
		<>
			{plankPosition ? (
				<div>OpponentPlank</div>
			) : (
				<></>
			)}
		</>
	)
}

export default OpponentPlank;