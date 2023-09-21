import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {FriendListDTO, IdAndNameDTO, NewUserDTO, ScoreCardDTO} from './user-dto'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(userData) {
        return this.prisma.user.create({ data: userData });
    }

    async newUser(userData: NewUserDTO): Promise<void> {
        await this.prisma.user.create({ data: userData });
    }

    async getAllUsers(): Promise<IdAndNameDTO[]>
    {
        const users = await this.prisma.user.findMany({
            select: { id: true, name: true }
        });
        if (users.length === 0)
            return [];

        return users.map(({id, name}) => {
            return new IdAndNameDTO(id, name);
        })
    }

    async getScoreCard(userID: number): Promise<ScoreCardDTO>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true,
                name: true,
                title: true,
                matches: true,
                mmr: true,
                winrate: true
            }
        });
        if (!user)
            throw new Error('getScoreCard: User not found');

        return {
            id: user.id,
            name: user.name,
            badge: user.title,
            matches: user.matches.length,
            winrate: user.winrate,
            mmr: user.mmr,
        };
    }

    async getMatches(userID: number): Promise<number[]>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userID },
            select: { matches: true    }
        });
        if (!user)
            throw new Error('getMatches: User not found');
        return user.matches;
    }

    async getFriends(userID: number): Promise<IdAndNameDTO[]>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userID },
            select: { friends: true    }
        });
        if (!user)
            throw new Error('getFriends');
        const friends = await this.prisma.user.findMany({
            where: {
                id: { in: user.friends },
            },
            select: {
                id: true,
                name: true,
            }
        });
        if (friends.length === 0)
            return [];
        return friends.map(({id, name}) => {
            return new IdAndNameDTO(id, name);
        });
    }

    async getOnlineFriends(userId: number): Promise<IdAndNameDTO[]>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { friends: true }
        });
        if (!user)
            throw new Error('getOnlineFriends');

        const onlineFriends = await this.prisma.user.findMany({
            where: {
                id: { in: user.friends },
                online: true
            },
            select: {
                id: true,
                name: true,
            }
        });
        if (onlineFriends.length === 0)
            return [];
        return onlineFriends.map(({id, name}) => {
            return new IdAndNameDTO(id, name);
        });
    }

    async getFriendsData(userId: number): Promise<FriendListDTO>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                friends: true,
                friendReq_out: true,
                friendReq_in: true,
                blocked: true
            }
        });
        if (!user)
            throw new Error('getFriendsData: User not found');

        return {
            friends: user.friends,
            friendReq_out: user.friendReq_out,
            friendReq_in: user.friendReq_in,
            blocked: user.blocked
        };
    }
    //TODO try throw these instead of if(!) all functions!
    async getTopScoreCards(n: number): Promise<ScoreCardDTO[]>{
        const topUsers = await this.prisma.user.findMany({
            where: { matches: { isEmpty: false } },
            orderBy: { mmr: 'desc' },
            take: n
        });

        return topUsers.map(({id, name, title, matches, mmr, winrate}) => {
                return new ScoreCardDTO(
                    id, name, title, matches.length, mmr, winrate,);
        });
    }
}
