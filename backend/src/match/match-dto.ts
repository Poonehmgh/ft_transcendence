import { Match } from "@prisma/client";
import { GameData } from "../game/game.queue";
import { UserService } from "src/user/user.service";

export class MatchDTO {
    id: number;
    begin: Date | null;
    end: Date | null;
    length_sec: number | null;
    player1Id: number;
    player1Name: string;
    player1Score: number;
    player2Id: number;
    player2Name: string;
    player2Score: number;
    winnerId: number | null;
    winnerName: string | null;

    static async fromMatch(match: Match, userService: UserService): Promise<MatchDTO> {
        const player1Name = await userService.getNameById(match.player1);
        const player2Name = await userService.getNameById(match.player2);

        const matchDTO: MatchDTO = {
            id: match.id,
            begin: match.begin,
            end: match.end,
            length_sec: match.length_sec,
            player1Id: match.player1,
            player1Name: player1Name,
            player1Score: match.score_p1,
            player2Id: match.player2,
            player2Name: player2Name,
            player2Score: match.score_p2,
            winnerId: match.winner_id,
            winnerName: match.winner_name,
        };

        return matchDTO;
    }
}

export class MatchInfoDTO {
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
            this.winner_name = "Draw"; // Handle the case of a draw
        }
    }
}
