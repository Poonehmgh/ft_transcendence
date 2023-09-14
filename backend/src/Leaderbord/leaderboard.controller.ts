import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { LeaderBoardService } from './leaderboard.service';


@Controller('leaderboard')
export class LeaderBoardController {
    constructor(private readonly leaderBoardService: LeaderBoardService) {}

	@Get('displayLeaderBoard')
	async displayLeaderBoard() {
		return await this.leaderBoardService.getLeaderBoard();
	}

	@Get('createUser/:id')
	async createUserTest( @Param('id') userNum: string) {
		return await this.leaderBoardService.createUser(Number(userNum));
	}
}
