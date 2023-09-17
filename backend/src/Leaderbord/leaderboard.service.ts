import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import {User} from "@prisma/client";

@Injectable()
export class LeaderBoardService {
    constructor(private readonly prisma: PrismaService) {}

	async getLeaderBoard()
	{
		return this.prisma.user.findUnique({where: {intraID:0}});
	}

	async createUser(userNum: number) {
		return this.prisma.user.create({
			data:{
				intraID: userNum,
				name: "defaultj",
				email: "defaulteamijl",
				passHash: "paskjsity"
			}})
	}

}


