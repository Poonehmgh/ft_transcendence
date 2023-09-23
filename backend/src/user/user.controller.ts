import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import {FriendListDTO, FriendStatus, IdAndNameDTO, NewUserDTO, ScoreCardDTO, UserProfileDTO} from './user-dto';
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

    @Get('profile')
    async getProfile(@Query('id') userId: number): Promise<UserProfileDTO> {
        return this.userService.getProfile(userId);
    }

    @Get('scorecard')
    async getScoreCard(userId: number): Promise<ScoreCardDTO> {
        return this.userService.getScoreCard(userId);
    }

    @Get('leaderboard')
    async getTopScoreCards(@Query('top') top: number): Promise<ScoreCardDTO[]> {
        return this.userService.getTopScoreCards(top);
    }

    @Get('matches')
    async getMatches(userId: number): Promise<number[]> {
        return this.userService.getMatches(userId);
    }

    @Get('friendStatus')
    async getFriendStatus(
        @Query('id1') userId: number,
        @Query('id2') otherUserId: number
    ): Promise<FriendStatus> {
        return this.userService.getFriendStatus(userId, otherUserId);
    }

    @Get('friends')
    async getFriends(userId: number): Promise<IdAndNameDTO[]> {
        return this.userService.getFriends(userId);
    }

    @Get('friends_online')
    async getOnlineFriends(userId: number): Promise<IdAndNameDTO[]> {
        return this.userService.getOnlineFriends(userId);
    }

    @Get('friends_data')
    async getFriendsData(userId: number): Promise<FriendListDTO> {
        return this.userService.getFriendsData(userId);
    }
}
