function isTwoNumberArray(variable: any): boolean {
	if (Array.isArray(variable) && variable.length === 2) {
		// Check if both elements in the array are numbers
		return (
			typeof variable[0] === 'number' &&
			typeof variable[1] === 'number'
		);
	}
	return false;
}

export class JoinGameDTO {
	userID: number;


}

export function isJoinGameDTOValid(data: JoinGameDTO): boolean {
	if (typeof data.userID !== 'number') {
		console.log(`type was invalid`)
		return false;
	}
	return true;
}

export class PlankUpdateDTO {
	userID: number;
	plankPosition: number;

}

export function isPlankUpdateDTOValid(data: PlankUpdateDTO): boolean {
	if (typeof data.plankPosition !== 'number' || typeof data.userID !== 'number') {
		console.log(`type was invalid`)
		return false;
	}
	return true;
}

//maybe add time or game data
export class GameUpdateDTO {
	enemyPlankPosition: number;
	ballPosition: [number, number];

	constructor(enemyPlankPosition: number, ballPosition: [number, number]) {
		this.enemyPlankPosition = enemyPlankPosition;
		this.ballPosition = ballPosition;
	}

}

export function isGameUpdateDTOValid(data: GameUpdateDTO): boolean {
	if (isTwoNumberArray(data.ballPosition) || typeof data.enemyPlankPosition == 'number')
		return false;
	return true;
}
