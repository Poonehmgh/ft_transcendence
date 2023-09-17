import { Controller, Post, Get, Body } from '@nestjs/common';
import {FriendListDTO, IdAndNameDTO, NewUserDTO, ScoreCardDTO} from '../../../shared/DTO/user-dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}


    @Post()
    async createUser(@Body() userData) {
        return this.userService.createUser(userData);
    }
	@Post('new')
	async newUser(userInfo: NewUserDTO): Promise<void> {
		await this.userService.newUser(userInfo);
	}

    @Get('all')
    async getAllUsers(): Promise<IdAndNameDTO[]> {
        return this.userService.getAllUsers();
    }

	@Get('scorecard')
	async getScoreCard(userID: number): Promise<ScoreCardDTO> {
		return this.userService.getScoreCard(userID);
	}

	@Get('matches')
	async getMatches(userID: number): Promise<number[]> {
		return this.userService.getMatches(userID);
	}

	@Get('friends')
	async getFriends(userID: number): Promise<IdAndNameDTO[]> {
		return this.userService.getFriends(userID);
	}

	@Get('friends_online')
	async getOnlineFriends(userID: number): Promise<IdAndNameDTO[]> {
		return this.userService.getOnlineFriends(userID);
	}

	@Get('friends_data')
	async getFriendsData(userID: number): Promise<FriendListDTO> {
		return this.userService.getFriendsData(userID);
	}
}
