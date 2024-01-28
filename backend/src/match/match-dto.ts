import { Match } from "@prisma/client";
import {GameData} from "../game/game.queue";

export class MatchDTO {
	id: number;
	begin: Date | null;
	end: Date | null;
	length_sec: number;
	player1_id: number;
	player2_id: number;
	score_p1: number;
	score_p2: number;
	winner_id: number | null;
	winner_name: string | null;
  
	constructor(match: Match) {
	  this.id = match.id;
	  this.begin = match.begin || null;
	  this.end = match.end || null;
	  this.length_sec = match.length_sec;
	  this.player1_id = match.player1;
	  this.player2_id = match.player2;
	  this.score_p1 = match.score_p1;
	  this.score_p2 = match.score_p2;
	  this.winner_id = match.winner_id || null;
	  this.winner_name = match.winner_name || null;
	}
  }

export class MatchInfoDTO
{
	begin: Date;
	length_sec: number;
	// player1_name: string;
	// player2_name: string;
	score_p1: number;
	score_p2: number;
	player1: number;
	player2: number;
	winner_name: string;
	winner_id: number = 0;

	constructor(data: GameData) {
		// Extracting information from GameData
		const { infoUser1, infoUser2, ScorePlayer1, ScorePlayer2 } = data;

		// Setting the properties of MatchInfoDTO
		this.begin = new Date(); // You can set this to the appropriate value
		this.length_sec = 0; // You can calculate the duration based on your logic
		// this.player1_name = infoUser1.userName; // Assuming username is a property of userGateway
		// this.player2_name = infoUser2.userName; // Assuming username is a property of userGateway
		this.player1 = infoUser1.userID;
		this.player2 = infoUser2.userID;
		this.score_p1 = ScorePlayer1;
		this.score_p2 = ScorePlayer2;


		if (ScorePlayer1 > ScorePlayer2) {
			this.winner_name = infoUser1.userName;
			this.winner_id = infoUser1.userID;
		} else if (ScorePlayer2 > ScorePlayer1) {
			this.winner_name = infoUser2.userName;
			this.winner_id = infoUser2.userID;
		} else {
			this.winner_name = 'Draw'; // Handle the case of a draw
		}
	}
}
