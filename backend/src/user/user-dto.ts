import { IsNotEmpty, IsString, Matches, Length } from "class-validator";

// User

export class NewUserDTO {
    constructor(public id: number, public name: string, public email: string) {}
}

export class IdAndNameDTO {
    constructor(public id: number, public name: string) {}
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
        public online: boolean
    ) {}
}

export enum UserRelation {
    friends,
    request_sent,
    request_received,
    blocked,
    none,
}

export class ChangeNameDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 15, {
        message: "name must be from 3 to 15 characters",
    })
    @Matches(/^[A-Za-z]{3}[A-Za-z0-9_]*$/, {
        message:
            "first three characters must be alphabetic, the rest can be alphanumerical",
    })
    newName: string;
}
