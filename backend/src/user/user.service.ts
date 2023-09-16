import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
<<<<<<< HEAD
import { PlayerCardDTO } from '../../../shared/user-dto';
=======
import { FriendListDTO, ScoreCardDTO, IdAndNameDTO, NewUserDTO } from '../../../shared/DTO/user-dto'
>>>>>>> b3c9a6799058f4395b9f8acd9e45d5225c44d9ea

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
				id: true,
				name: true,
			}
		});
		if (users.length === 0)
			return [];
		
		const idAndNameDTOs = users.map(elmnt => {
			return new IdAndNameDTO(elmnt.id, elmnt.name);
		});

		return idAndNameDTOs;
	}

	async getScoreCard(userID: number): Promise<ScoreCardDTO>
	{
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
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

		const scoreCard: ScoreCardDTO = {
			name: user.name,
			badge: user.badgeName,
			matches: user.matches.length,
			wins: user.wins,
			winrate: user.wins / user.matches.length,
			mmr: user.mmr,
			online: user.online
		}

		return scoreCard;
	}

	async getMatches(userID: number): Promise<number[]>
	{
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
			select: { matches: true	}
		});
		if (!user)
			throw new Error('getMatches: User not found');

		return user.matches;
	}

	async getFriends(userID: number): Promise<IdAndNameDTO[]>
	{
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
			select: { friends: true	}
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
		
		const idAndNameDTOs = friends.map((elmnt) => {
			return new IdAndNameDTO(elmnt.id, elmnt.name);
		});
		
		return idAndNameDTOs;
	}

	async getOnlineFriends(userID: number): Promise<IdAndNameDTO[]>
	{
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
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
		
		const idAndNameDTOs = onlineFriends.map(elmnt => {
			return new IdAndNameDTO(elmnt.id, elmnt.name);
		});

		return idAndNameDTOs;
	}
	
	async getFriendsData(userID: number): Promise<FriendListDTO>
	{
		const user = await this.prisma.user.findUnique({
			where: { id: userID },
			select: {
				friends: true,
				friendReq_out: true,
				friendReq_in: true,
				blocked: true
			}
		});
		if (!user)
		throw new Error('getFriendsData: User not found');
		
		const friendListData: FriendListDTO = {
			friends: user.friends,
			friendReq_out: user.friendReq_out,
			friendReq_in: user.friendReq_in,
			blocked: user.blocked
		}
		
		return friendListData;
	}
}
