import {Injectable} from "@nestjs/common";
import {GameUpdateDTO, NewRoundDTO, PlankUpdateDTO} from "./game.DTOs";
import {Socket} from "socket.io";
import {PrismaService} from "../prisma/prisma.service";
import {MatchInfoDTO} from "../match/match-dto";

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
    VelocityBall: [number, number] = [1, 0];

    //1 is active, 0 is inactive ,3 its being deleted
    GameStatus: number = 1;
    intervalTime: number = 69;


    //constants
    fieldWidth: number = 100;
    fieldHeight: number = 100;
    ballRadius: number = 2;
    plankWidth: number = 1.5;
    plankHeight: number = 35;

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
        // console.log(this);
        if (this.PositionBall[0] - this.ballRadius < this.plankWidth
            && this.PositionBall[1] > this.PositionPlank1
            && this.PositionBall[1] < this.PositionPlank1 + this.plankHeight) {
            console.log("LEFT COLLISION");
            const relativeHitPosition = (this.PositionBall[1] - this.PositionPlank1) - (this.plankHeight / 2);
            this.VelocityBall[1] = relativeHitPosition / (this.plankHeight / 2);
            this.VelocityBall[0] *= -1;
        }
        if (this.PositionBall[0] + this.ballRadius >= this.fieldWidth - this.plankWidth
            && this.PositionBall[1] > this.PositionPlank2
            && this.PositionBall[1] < this.PositionPlank2 + this.plankHeight) {
            console.log("RIGHT COLLISION");
            // console.log(this);
            const relativeHitPosition = (this.PositionBall[1] - this.PositionPlank2) - (this.plankHeight / 2);
            this.VelocityBall[1] = relativeHitPosition / (this.plankHeight / 2); // Adjust vertical speed + can be tweaked with additional coefficients
            this.VelocityBall[0] *= -1;
        }
    }

    sendNewRoundMessage = () => {
        if (this.GameStatus == 1) {
            this.infoUser1.socket.emit('newRound', new NewRoundDTO(this));
            this.infoUser2.socket.emit('newRound', new NewRoundDTO(this));
        }
    }

    resetGameData = () => {
        this.PositionPlank1 = 0;
        this.PositionPlank2 = 0;
        this.PositionBall = [50, 50];
        this.VelocityBall = [1, 0];
    }


    async addPointToUser(user: number) {
        if (user == 1) {
            this.ScorePlayer2++;
        } else if (user == 2) {
            this.ScorePlayer1++;
        }
        if (this.ScorePlayer1 >= 3) {
            // await this.prismaService.match.create({
            // 	data: new MatchInfoDTO(this),
            // })
            this.infoUser1.socket.emit('gameResult', 'Won');
            this.infoUser2.socket.emit('gameResult', 'Lost');
            clearInterval(this.interval);
            this.GameStatus = 0;
            return;
        }
        if (this.ScorePlayer2 >= 3) {
            // await this.prismaService.match.create({
            // 	data: new MatchInfoDTO(this),
            // })
            this.infoUser2.socket.emit('gameResult', 'Won');
            this.infoUser1.socket.emit('gameResult', 'Lost');
            clearInterval(this.interval);
            this.GameStatus = 0;
            return;
        }
        // console.log(this);
        this.resetGameData();
        this.sendNewRoundMessage();
        console.log(`points for player ${user}`)
        // console.log(this);
        clearInterval(this.interval);
        this.intervalTime = 69;
        this.interval = setInterval(this.gameLogic, this.intervalTime);
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
        this.infoUser2.socket.emit('gameUpdate', new GameUpdateDTO(this.PositionPlank1, this.PositionBall));
    }

    gameLogic = () => {
        if(this.GameStatus !== 3)
				{
				this.plankCollision();
        this.updateBallPosition();
        this.fieldCollision();
        clearInterval(this.interval);
        this.interval = setInterval(this.gameLogic, this.intervalTime);
				}
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
    gameCheckerInterval: NodeJS.Timer = null;

    constructor(private readonly prismaService: PrismaService) {
        console.log("Starting game queue");
    }

    updatePlankPosition = (data: PlankUpdateDTO) => {
        const gameData: GameData = this.gameList.find(
            (elem) =>
                elem.infoUser1.userID === data.userID ||
                elem.infoUser2.userID === data.userID
        );
        if (gameData) {
            // Update the plank position based on the user's ID
            if (gameData.infoUser1.userID === data.userID) {
                gameData.PositionPlank1 = data.plankPosition;
            } else if (gameData.infoUser2.userID === data.userID) {
                gameData.PositionPlank2 = data.plankPosition;
            }
            //add socket message about game start with initial data
            console.log(`updated successfully`);
            console.log(this.gameList);
        }
    };

    incrementScoreInDB = async(userID: number) => {
        await this.prismaService.user.update({
            where: {
                id: userID,
            },
            data: {
                mmr: {
                    increment: 50,
                },
            },
        });
    }

    decrementScoreInDB = async(userID: number) => {
        await this.prismaService.user.update({
            where: {
                id: userID,
            },
            data: {
                mmr: {
                    decrement: 50,
                },
            },
        });
    }

  	calculateWinRate = async(userId: number) => {
        let matches = await this.prismaService.match.findMany({
            where: {
                OR: [
                    {
                        player1: userId,
                    },
                    {
                        player2: userId,
                    },
                ],
            },
        });
        let wins = 0;
        let losses = 0;
        for (let match of matches){
            if (match.winner_id == userId){
                wins++;
            } else {
                losses++;
            }
        }
        let winRate = wins / (wins + losses);
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                winrate: winRate,
            },
        });

    }

    addGameToUserList = async(gameId: number, userId: number) => {
        //add game id to user
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                matches: {
                    push: gameId,
            },
        }
        });
    }

    gameEnder = async(game: GameData) => {
        let match = await this.prismaService.match.create({
            data: {
                end: new Date(),
                length_sec: 69,
                begin: new Date(),
                player1: game.infoUser1.userID,
                player2: game.infoUser2.userID,
                score_p1: game.ScorePlayer1,
                score_p2: game.ScorePlayer2,
                winner_id: game.ScorePlayer1 > game.ScorePlayer2 ? game.infoUser1.userID : game.infoUser2.userID,
                winner_name: game.ScorePlayer1 > game.ScorePlayer2 ? game.infoUser1.userName : game.infoUser2.userName,
            },
        });
        await this.addGameToUserList(match.id, game.infoUser1.userID);
        await this.addGameToUserList(match.id, game.infoUser2.userID);
        console.log(match);
        //player 1 wins
        if (game.ScorePlayer1 > game.ScorePlayer2) {
            game.infoUser1.socket.emit('gameResult', 'Won');
            game.infoUser2.socket.emit('gameResult', 'Lost');
            await this.incrementScoreInDB(game.infoUser1.userID);
            await this.decrementScoreInDB(game.infoUser2.userID);
        } else if (game.ScorePlayer1 < game.ScorePlayer2) {
            game.infoUser2.socket.emit('gameResult', 'Won');
            game.infoUser1.socket.emit('gameResult', 'Lost');
            await this.incrementScoreInDB(game.infoUser2.userID);
            await this.decrementScoreInDB(game.infoUser1.userID);
        } else {
            game.infoUser1.socket.emit('gameResult', 'Draw');
            game.infoUser2.socket.emit('gameResult', 'Draw');
        }
        await this.calculateWinRate(game.infoUser1.userID);
        await this.calculateWinRate(game.infoUser2.userID);
    }


    gameCleaner = async () => {
        const indexToRemove = this.gameList.findIndex((game) => game.GameStatus === 0 );

        if (indexToRemove !== -1) {
					this.gameList[indexToRemove].GameStatus = 3;
						const game: GameData = this.gameList[indexToRemove];
            // Use splice to remove the item at the found index
            await this.gameEnder(game);
            clearInterval(game.interval);
            console.log(`deleted a game`, "\n" +
                ". . . . . . . . . . .,'´`. ,'``;\n" +
                ". . . . . . . . . .,`. . .`—–'..\n" +
                ". . . . . . . . . .,. . . . . .~ .`- .\n" +
                ". . . . . . . . . ,'. . . . . . . .o. .o__\n" +
                ". . . . . . . . _l. . . . . . . . . . . .\n" +
                ". . . . . . . _. '`~-.. . . . . . . . . .,'\n" +
                ". . . . . . .,. .,.-~-.' -.,. . . ..'–~`\n" +
                ". . . . . . /. ./. . . . .}. .` -..,/\n" +
                ". . . . . /. ,'___. . :/. . . . . .\n" +
                ". . . . /'`-.l. . . `'-..'........ . .\n" +
                ". . . ;. . . . . . . . . . . . .)-.....l\n" +
                ". . .l. . . . .' —........-'. . . ,'\n" +
                ". . .',. . ,....... . . . . . . . . .,'\n" +
                ". . . .' ,/. . . . `,. . . . . . . ,'_____\n" +
                ". . . . .. . . . . .. . . .,.- '_______|_')\n" +
                ". . . . . ',. . . . . ',-~'`. (.))\n" +
                ". . . . . .l. . . . . ;. . . /__\n" +
                ". . . . . /. . . . . /__. . . . .)\n" +
                ". . . . . '-.. . . . . . .)\n" +
                ". . . . . . .' - .......-`\n");
            this.gameList.splice(indexToRemove, 1);
        }
    }

    initGame = (userInfo1: userGateway, userInfo2: userGateway) => {
        const gameToStart = new GameData(userInfo1, userInfo2, Math.floor(Math.random() * 1000))
        if (!this.gameList.includes(gameToStart)) {
            gameToStart.sendNewRoundMessage();
            gameToStart.interval = setInterval(gameToStart.gameLogic, 69);
            console.log(`initialized game with`);
            this.gameList.push(gameToStart);//add id gen from prisma
        }
        if (this.gameCheckerInterval == null) {
            this.gameCheckerInterval = setInterval(this.gameCleaner, 10);
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
    };

    async checkIfSocketIsAssignedToId(socket: Socket, id: number): Promise<boolean> {
        const socketIdDB = await this.prismaService.user.findFirst({
            where: {
                id: id,
            },
            select: {
                socketId: true,
            },
        });
        if (socketIdDB == null || socketIdDB.socketId != socket.id) {
            return false;
        }
        return true;
    }

    async addPlayerToQueue(userInfo: userGateway): Promise<void> {
        const userIndex = this.userQueue.findIndex(
            (user) => user.userID === userInfo.userID
        );
        if (userIndex !== -1) {
            userInfo.socket.emit("queueConfirm", "Already in queue");
            return;
        }
        const game = this.findGameByUser(userInfo);
        if (game != null) {
            userInfo.socket.emit("queueConfirm", "Already in game");
            userInfo.socket.emit("newRound", new NewRoundDTO(game));
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
            userInfo.socket.emit("queueConfirm", "InvalidID");
            return;
        }
        userInfo.userName = name.name;
        if (this.userQueue.includes(userInfo)) return;
        if (!(await this.checkIfSocketIsAssignedToId(userInfo.socket, userInfo.userID))) {
            userInfo.socket.emit("queueConfirm", "Socket is not assigned to this id");
            return;
        }
        this.userQueue.push(userInfo);
        console.log(`Added user ${userInfo} to the queue`);
        if (this.userQueue.length >= 2)
            this.initGame(this.userQueue.pop(), this.userQueue.pop());
        userInfo.socket.emit("queueConfirm", "Confirmed");
    }

    // checkers

    isUserInQueue = (userId: number): boolean => {
        return this.userQueue.some((user) => user.userID === userId);
    };

    isUserInMatch = (userId: number): boolean => {
        return this.gameList.some(
            (game) => game.infoUser1.userID === userId || game.infoUser2.userID === userId
        );
    };
}