import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import {FriendListDTO, IdAndNameDTO, NewUserDTO, ScoreCardDTO} from './user-dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('new')
    async newUser(@Body() userInfo: NewUserDTO): Promise<any> {
        try {
            await this.userService.newUser(userInfo);
            return { message: 'User created.' };
        } catch {
            return {
                StatusCode: 500,
                message: 'Failed to create user.'
            }
        }
    }

    @Get('all')
    async getAllUsers(): Promise<IdAndNameDTO[]> {
        return this.userService.getAllUsers();
    }

    @Get('scorecard')
    async getScoreCard(userID: number): Promise<ScoreCardDTO> {
        return this.userService.getScoreCard(userID);
    }

    @Get('leaderboard')
    async getTopScoreCards(@Query('top') top: number): Promise<ScoreCardDTO[]> {
        return this.userService.getTopScoreCards(top);
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
