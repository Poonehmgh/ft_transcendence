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
