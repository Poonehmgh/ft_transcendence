import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {FriendListDTO, FriendStatus, IdAndNameDTO, NewUserDTO, ScoreCardDTO, UserProfileDTO} from './user-dto'
import {User} from "@prisma/client";

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

    async getScoreCard(userId: number): Promise<ScoreCardDTO>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
            title: user.title,
            matches: user.matches.length,
            winrate: user.winrate,
            mmr: user.mmr,
        };
    }

    async getMatches(userId: number): Promise<number[]>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { matches: true }
        });
        if (!user)
            throw new Error('getMatches: User not found');
        return user.matches;
    }

    async getProfile(userId: number): Promise<UserProfileDTO>
    {
        const profile = await this.prisma.user.findUnique( {
            where: { id: Number(userId)},
            select: {
                id: true,
                name: true,
                email: true,
                avatarURL: true,
                title: true,
                mmr: true,
                matches: true,
                winrate: true,
                online: true
            }
        });
        if (!profile)
            throw new Error('getProfile: User not found');
        return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            avatarURL: profile.avatarURL,
            title: profile.title,
            mmr: profile.mmr,
            matches: profile.matches.length,
            winrate: profile.winrate,
            online: profile.online
        };
    }

    async getFriendStatus(userId: number, otherUserId: number): Promise<FriendStatus>
    {
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                friends: true,
                friendReq_out: true,
                friendReq_in: true,
            },
        });
        if (!user)
            throw new Error('getFriendStatus');

        if (otherUserId in user.friends)
            return FriendStatus.friends;
        if (otherUserId in user.friendReq_out)
            return FriendStatus.request_sent;
        if (otherUserId in user.friendReq_in)
            return FriendStatus.request_received;
        return FriendStatus.none;
    }

    async getFriends(userId: number): Promise<IdAndNameDTO[]>
    {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
        const topUsers: User[] = await this.prisma.user.findMany({
            where: { matches: { isEmpty: false } },
            orderBy: { mmr: 'desc' },
            take: Number(n)
        });

        return topUsers.map(({id, name, title, matches, mmr, winrate}) => {
                return new ScoreCardDTO(
                    id, name, title, mmr, matches.length, winrate);
        });
    }
}
