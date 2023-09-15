import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlayerCardDTO } from '../../../shared/user-dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(userData) {
        return this.prisma.user.create({ data: userData });
    }

    async getAllUsers()  {
        return this.prisma.user.fields
    }

	async playerCard(userId: number): Promise<PlayerCardDTO>
	{
		const user = await this.prisma.user.findUnique(
		{
			where:
			{
				id: userId
			},
			select:
			{
				name: true,
				games: true,
				wins: true,
				goals: true,
				mmr: true,
				badgeName: true,
				online: true
			}
		}
		);

		if (!user)
			throw new Error('User not found');
		
		let returnCard: PlayerCardDTO = {name: "knudel"};

		return returnCard;

	}
}
