import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() userData) {
        return this.userService.createUser(userData);
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

	@Get('scorecard')
	async getScoreCard(userID: number) {
		return this.userService.getScoreCard(userID);
	}

	@Get('matches')
	async getMatches(userID: number) {
		return this.userService.getMatches(userID);
	}

	@Get('friends')
	async getFriends(userID: number) {
		return this.userService.getFriends(userID);
	}

	@Get('friends_online')
	async getOnlineFriends(userID: number) {
		return this.userService.getOnlineFriends(userID);
	}

	@Get('friends_data')
	async getFriendsData(userID: number) {
		return this.userService.getFriendsData(userID);
	}
}
