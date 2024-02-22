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
}

export class GameInviteDTO {
	senderId: number;
	senderName: string;
	recipientId: number;
	recipientName: string;
	payload?: string;
}