import {GameData} from "../game/game.queue";

export class MatchInfoDTO
{
	begin: Date;
	duration: number;
	player1_name: string;
	player2_name: string;
	player1_score: number;
	player2_score: number;
	player1: number;
	player2: number;
	winner: string

	constructor(data: GameData) {
		// Extracting information from GameData
		const { infoUser1, infoUser2, ScorePlayer1, ScorePlayer2 } = data;

		// Setting the properties of MatchInfoDTO
		this.begin = new Date(); // You can set this to the appropriate value
		this.duration = 0; // You can calculate the duration based on your logic
		this.player1_name = infoUser1.userName; // Assuming username is a property of userGateway
		this.player2_name = infoUser2.userName; // Assuming username is a property of userGateway
		this.player1 = infoUser1.userID;
		this.player2 = infoUser2.userID;
		this.player1_score = ScorePlayer1;
		this.player2_score = ScorePlayer2;

		// Determine the winner based on the scores and set it
		if (ScorePlayer1 > ScorePlayer2) {
			this.winner = this.player1_name;
		} else if (ScorePlayer2 > ScorePlayer1) {
			this.winner = this.player2_name;
		} else {
			this.winner = 'Draw'; // Handle the case of a draw
		}
	}
}
