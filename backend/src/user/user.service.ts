import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {FriendListDTO, IdAndNameDTO, NewUserDTO, ScoreCardDTO} from '../../../shared/DTO/user-dto'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async createUser(userData) {
		return this.prisma.user.create({ data: userData });
	}

	async newUser(userData: NewUserDTO) {
		const createdUser = await this.prisma.user.create({
			data: userData,
		});
	}

	async getAllUsers(): Promise<IdAndNameDTO[]>
	{
		const users = await this.prisma.user.findMany({
			select: {
				intraID: true,
				name: true,
			}
		});
		if (users.length === 0)
			return [];

		return users.map(elmnt => {
			return new IdAndNameDTO(elmnt.intraID, elmnt.name);
		})
	}

	async getScoreCard(userID: number): Promise<ScoreCardDTO>
	{
		const user = await this.prisma.user.findUnique({
			where: { intraID: userID },
			select: {
				name: true,
				badgeName: true,
				chats: true,
				matches: true,
				wins: true,
				mmr: true,
				online: true
			}
		});
		if (!user)
			throw new Error('getScoreCard: User not found');

		return {
			name: user.name,
			badge: user.badgeName,
			matches: user.matches.length,
			wins: user.wins,
			winrate: user.wins / user.matches.length,
			mmr: user.mmr,
			online: user.online
		};
	}

	async getMatches(userID: number): Promise<number[]>
	{
		const user = await this.prisma.user.findUnique({
			where: { intraID: userID },
			select: { matches: true	}
		});
		if (!user)
			throw new Error('getMatches: User not found');
		return user.matches;
	}

	async getFriends(userID: number): Promise<IdAndNameDTO[]>
	{
		const user = await this.prisma.user.findUnique({
			where: { intraID: userID },
			select: { friends: true	}
		});
		if (!user)
			throw new Error('getFriends');
		const friends = await this.prisma.user.findMany({
			where: {
				intraID: { in: user.friends },
			},
			select: {
				intraID: true,
				name: true,
			}
		});
		if (friends.length === 0)
			return [];
		return friends.map((elmnt) => {
			return new IdAndNameDTO(elmnt.intraID, elmnt.name);
		});
	}

	async getOnlineFriends(userID: number): Promise<IdAndNameDTO[]>
	{
		const user = await this.prisma.user.findUnique({
			where: { intraID: userID },
			select: { friends: true }
		});
		if (!user)
			throw new Error('getOnlineFriends');

		const onlineFriends = await this.prisma.user.findMany({
				where: {
					intraID: { in: user.friends },
					online: true
				},
				select: {
					intraID: true,
					name: true,
				}
		});
		if (onlineFriends.length === 0)
			return [];
		return onlineFriends.map(elmnt => {
			return new IdAndNameDTO(elmnt.intraID, elmnt.name);
		});
	}
	
	async getFriendsData(userID: number): Promise<FriendListDTO>
	{
		const user = await this.prisma.user.findUnique({
			where: { intraID: userID },
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
}
