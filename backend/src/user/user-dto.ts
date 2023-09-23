export class NewUserDTO
{
    constructor(
        public id: number,
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
        public title: string,
        public mmr: number,
        public matches: number,
        public winrate: number
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

export class UserProfileDTO
{
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public avatarURL: string,
        public title: string,
        public mmr: number,
        public matches: number,
        public winrate: number,
        public online: boolean
    ) {}
}