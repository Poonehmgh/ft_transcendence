import {Injectable} from "@nestjs/common";
import {GameUpdateDTO, NewRoundDTO, PlankUpdateDTO} from "./game.DTOs";
import {Socket} from "socket.io";
import {PrismaService} from "../prisma/prisma.service";

export class GameData {

	//user info
	infoUser1: userGateway
	infoUser2: userGateway
	gameID: number

	//variables
	ScorePlayer1: number = 0;
	ScorePlayer2: number = 0;
	PositionPlank1: number = 0;
	PositionPlank2: number = 0;
	PositionBall: [number, number] = [50, 50];
	VelocityBall: [number, number] = [10, 0];


	//constants
	fieldWidth: number = 100;
	fieldHeight: number = 100;
	ballRadius: number = 2;
	plankWidth: number = 10;
	plankHeight: number = 20;

	interval: NodeJS.Timer;

	constructor(infoUser1: userGateway, infoUser2: userGateway, gameID: number) {
		this.infoUser1 = infoUser1;
		this.infoUser2 = infoUser2;
		this.gameID = gameID;
	}

	getMirroredPosition = (): [number, number] => {
		return [100 - this.PositionBall[0], this.PositionBall[1]];
	}

	plankCollision = () => {
		if (this.PositionBall[0] - this.ballRadius < this.plankWidth
			&& this.PositionBall[1] > this.PositionPlank1
			&& this.PositionBall[1] < this.PositionPlank1 + this.plankHeight) {
			const relativeHitPosition = (this.PositionBall[1] - this.PositionPlank1) - (this.plankHeight / 2);
			this.VelocityBall[1] = relativeHitPosition / (this.plankHeight / 2);
			this.VelocityBall[0] *= -1;
		}
		if (this.PositionBall[0] - this.ballRadius >= this.fieldWidth - this.plankWidth
			&& this.PositionBall[1] > this.PositionPlank2
			&& this.PositionBall[1] < this.PositionPlank2 + this.plankHeight) {
			const relativeHitPosition = (this.PositionBall[1] - this.PositionPlank2) - (this.plankHeight / 2);
			this.VelocityBall[1] = relativeHitPosition / (this.plankHeight / 2); // Adjust vertical speed + can be tweaked with additional coefficients
			this.VelocityBall[0] *= -1;
		}
	}

	sendNewRoundMessage = () => {
		this.infoUser1.socket.emit('newRound', new NewRoundDTO(this));
		this.infoUser2.socket.emit('newRound', new NewRoundDTO(this));
	}

	resetGameData = () => {
		this.PositionPlank1 = 40;
		this.PositionPlank2 = 40;
		this.PositionBall = [50, 50];
		this.VelocityBall = [10, 0];
	}



	addPointToUser = (user: number) => {
		if (user == 1) {
			this.ScorePlayer1++;
		} else if (user == 2) {
			this.ScorePlayer2++;
		}
		console.log(`points for player ${user}`)
		clearInterval(this.interval);
		this.resetGameData();
		this.sendNewRoundMessage();
		console.log(this);
		this.interval = setInterval(this.gameLogic, 1000);
		console.log('restarted');

	}

	fieldCollision = () => {
		if (this.PositionBall[1] - this.ballRadius <= 0 || this.PositionBall[1] + this.ballRadius >= this.fieldHeight) {
			this.VelocityBall[1] *= -1;
		}
		if (this.PositionBall[0] - this.ballRadius < -10) {
			this.addPointToUser(1);
		} else if (this.PositionBall[0] + this.ballRadius >= this.fieldWidth + 10) {
			this.addPointToUser(2);
		}
	}

	updateBallPosition = () => {
		this.PositionBall[0] += this.VelocityBall[0];
		this.PositionBall[1] += this.VelocityBall[1];
		this.infoUser1.socket.emit('gameUpdate', new GameUpdateDTO(this.PositionPlank2, this.PositionBall));
		this.infoUser2.socket.emit('gameUpdate', new GameUpdateDTO(this.PositionPlank1, this.getMirroredPosition()));
	}

	gameLogic = () => {
		this.plankCollision();
		this.fieldCollision();
		this.updateBallPosition();
		// console.log(this);
	}
}

export class userGateway {
	userID: number;
	socket: Socket;
	userName: string = 'dummy';

	constructor(userID: number, socket: Socket) {
		this.userID = userID;
		this.socket = socket;
	}
}

@Injectable()
export class GameQueue {
	gameList: GameData[] = [];
	userQueue: userGateway[] = [];

	constructor(private readonly prismaService: PrismaService) {
	}

	updatePlankPosition = (data: PlankUpdateDTO) => {
		const gameData: GameData = this.gameList.find((elem) => elem.infoUser1.userID === data.userID || elem.infoUser1.userID === data.userID);
		if (gameData) {
			// Update the plank position based on the user's ID
			if (gameData.infoUser1.userID === data.userID) {
				gameData.PositionPlank1 = data.plankPosition;
			} else if (gameData.infoUser2.userID === data.userID) {
				gameData.PositionPlank2 = data.plankPosition;
			}
			//add socket message about game start with initial data
			console.log(`updated successfully`)
			console.log(this.gameList)
		}
	}

	initGame = (userInfo1: userGateway, userInfo2: userGateway) => {
		const gameToStart = new GameData(userInfo1, userInfo2, Math.floor(Math.random() * 1000))
		if (!this.gameList.includes(gameToStart)) {
			gameToStart.sendNewRoundMessage();
			gameToStart.interval = setInterval(gameToStart.gameLogic, 1000);
			console.log(`initialized game with`);
			this.gameList.push(gameToStart);//add id gen from prisma
		}
	}

	findGameByUser = (userInfo: userGateway): GameData => {
		for (const gameData of this.gameList) {
			if (gameData.infoUser1.userID === userInfo.userID) {
				gameData.infoUser1.socket = userInfo.socket;
				return gameData; // User is found in one of the GameData instances
			}
			if (gameData.infoUser2.userID === userInfo.userID) {
				gameData.infoUser2.socket = userInfo.socket;
				return gameData; // User is found in one of the GameData instances
			}
		}
		return null; // User is not found in any of the GameData instances
	}

	async addPlayerToQueue(userInfo: userGateway): Promise<void> {
		const game = this.findGameByUser(userInfo)
		if (game != null) {
			userInfo.socket.emit('newRound', new NewRoundDTO(game));
			return;
		}
		const name = await this.prismaService.user.findUnique({
			where: {
				id: userInfo.userID,
			},
			select: {
				name: true, // Select the 'name' field
			},
		});
		//check for invalid id
		if (userInfo.userName == null) {
			userInfo.socket.emit('queueConfirm', 'InvalidID');
			return;
		}
		userInfo.userName = name.name;
		if (this.userQueue.includes(userInfo))
			return;
		this.userQueue.push(userInfo);
		console.log(`Added user ${userInfo} to the queue`);
		if (this.userQueue.length >= 2)
			this.initGame(this.userQueue.pop(), this.userQueue.pop());
		userInfo.socket.emit('queueConfirm', 'Confirmed');
	}

}