export class MatchInfoDTO
{
	constructor(
		public matchBeginn: Date,
		public matchDuration: number,
		public player1_name: string,
		public player2_name: string,
		public player1_score: number,
		public player2_score: number,
		public winner: string
	) {}
}
