import {GameData, userGateway} from "./game.queue";

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

export class NewRoundDTO{
	//user info
	userID1: number
	userID2: number
	userName1: string
	userName2: string
	gameID: number

	//variables
	ScorePlayer1: number;
	ScorePlayer2: number;
	PositionPlank1: number;
	PositionPlank2: number;
	PositionBall: [number, number];


	//constants
	fieldWidth: number;
	fieldHeight: number;
	ballRadius: number;
	plankWidth: number;
	plankHeight: number;


	constructor(data : GameData) {
		this.userID1 = data.infoUser1.userID;
		this.userID2 = data.infoUser2.userID;
		this.userName1 = data.infoUser1.userName;
		this.userName2 = data.infoUser2.userName;
		this.gameID = data.gameID;

		this.ScorePlayer1 = data.ScorePlayer1;
		this.ScorePlayer2 = data.ScorePlayer2;
		this.PositionPlank1 = data.PositionPlank1;
		this.PositionPlank2 = data.PositionPlank2;
		this.PositionBall = data.PositionBall;


		this.fieldWidth = data.fieldWidth;
		this.fieldHeight = data.fieldHeight;
		this.ballRadius = data.ballRadius;
		this.plankWidth = data.plankWidth;
		this.plankHeight = data.plankHeight;
	}
}
