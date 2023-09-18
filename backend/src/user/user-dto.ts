export class NewUserDTO
{
	constructor(
		public id: number,
		public passHash: string,
		public name: string,
		public email: string,
	) {}
}

export class IdAndNameDTO
{
	constructor(
		public id: number,
		public name: string,
	) {}
}

export class ScoreCardDTO
{
	constructor(
		public id: number,
		public name: string,
		public badge: string,
		public matches: number,
		public wins: number,
		public winrate: number,
		public mmr: number,
		public online: boolean
	) {}
}

export class FriendListDTO
{
	constructor(
		public friends: number[],
		public friendReq_out: number[],
		public friendReq_in: number[],
		public blocked: number[],
	) {}
}

