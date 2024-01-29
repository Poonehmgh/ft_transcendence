export enum UserRelation {
	friends,
	request_sent,
	request_received,
	blocked,
	none,
  }
  
  export class UserProfileDTO {
    constructor(
        public id: number,
        public name: string,
        public mmr: number,
        public rank: string,
        public matches: number,
        public winrate: number,
        public online: boolean
    ) {}
}

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