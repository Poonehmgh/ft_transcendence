export class NewUserDTO {
    constructor(public id: number, public name: string, public email: string) {}
}

export class IdAndNameDTO {
    constructor(public id: number, public name: string) {}
}

export class UserStatusDTO {
    constructor(
        public id: number,
        public name: string,
        public online: boolean,
        public inGame: boolean
    ) {}
}

export class ScoreCardDTO {
    constructor(
        public id: number,
        public name: string,
        public rank: string,
        public mmr: number,
        public matches: number,
        public winrate: number
    ) {}
}

export class FriendListDTO {
    constructor(
        public friends: number[],
        public friendReq_out: number[],
        public friendReq_in: number[],
        public blocked: number[]
    ) {}
}

export class UserProfileDTO {
    constructor(
        public id: number,
        public name: string,
        public mmr: number,
        public rank: string,
        public matches: number,
        public winrate: number,
        public online: boolean,
        public inGame: boolean
    ) {}
}

export enum UserRelation {
    friends,
    request_sent,
    request_received,
    blocked,
    none,
}
