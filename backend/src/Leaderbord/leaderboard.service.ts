import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import {User} from "@prisma/client";

@Injectable()
export class LeaderBoardService {
    constructor(private readonly prisma: PrismaService) {}

	async getLeaderBoard()
	{
		return this.prisma.user.findUnique({where: {id:0}});
	}

<<<<<<< HEAD
	async createUser(userNum: number)
	{
		return this.prisma.user.create(
			{
				data:
				{
					id: userNum,
					name: "defaultj",
					email: "defaulteamijl",
					intraID: "intraIiD",
					passHash: "paskjsity"
				}
			})
=======
	async createUser(userNum: number) {
		return this.prisma.user.create({
			data:{
				id: userNum,
				name: "defaultj",
				email: "defaulteamijl",
				intraID: "intraIiD",
				passHash: "paskjsity" 
			}})
>>>>>>> b3c9a6799058f4395b9f8acd9e45d5225c44d9ea
	}

}


