import { Controller, Get, Post, Query, Body, Req, Res } from "@nestjs/common";
import { Response } from "express";
import {
  FriendListDTO,
  UserRelation,
  IdAndNameDTO,
  NewUserDTO,
  ScoreCardDTO,
  UserProfileDTO,
  ChangeNameDto,
} from "./user-dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("new")
  async newUser(@Body() userInfo: NewUserDTO): Promise<any> {
    try {
      await this.userService.newUser(userInfo);
      return { message: "User created." };
    } catch {
      return {
        StatusCode: 500,
        message: "Failed to create user.",
      };
    }
  }

  @Get("profile")
  async getProfile(@Query("id") userId: number): Promise<UserProfileDTO> {
    return this.userService.getProfile(userId);
  }

  @Get("scorecard")
  async getScoreCard(userId: number): Promise<ScoreCardDTO> {
    return this.userService.getScoreCard(userId);
  }

  @Get("leaderboard")
  async getTopScoreCards(@Query("top") top: number): Promise<ScoreCardDTO[]> {
    return this.userService.getTopScoreCards(top);
  }

  @Get("matches")
  async getMatches(userId: number): Promise<number[]> {
    return this.userService.getMatches(userId);
  }

  @Get("friendStatus")
  async getFriendStatus(
    @Query("id1") userId: number,
    @Query("id2") otherUserId: number
  ): Promise<UserRelation> {
    return this.userService.getFriendStatus(userId, otherUserId);
  }

  @Get("friends")
  async getFriends(userId: number): Promise<IdAndNameDTO[]> {
    return this.userService.getFriends(userId);
  }

  @Get("friends_online")
  async getOnlineFriends(userId: number): Promise<IdAndNameDTO[]> {
    return this.userService.getOnlineFriends(userId);
  }

  @Get("friends_data")
  async getFriendsData(userId: number): Promise<FriendListDTO> {
    return this.userService.getFriendsData(userId);
  }

  // getters

  @Get("all_idnames")
  async getAllIdsAndNames(): Promise<IdAndNameDTO[]> {
    return this.userService.getAllIdsAndNames();
  }

  @Get("all_users")
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get("other_users")
  async getOtherUsers(@Body() body: { thisId: number }) {
    const { thisId } = body;
    return this.userService.getOtherUsers(thisId);
  }

  // profile management

  @Post("change_name")
  async changeName(@Body() changeNameDTO: ChangeNameDto, @Res() res: Response) {
    const errorType = await this.userService.changeName(
      changeNameDTO.id,
      changeNameDTO.newName
    );
    // 0 = no error
    // 1 = uniqueness constraint violation
    // 2 = any other error
    if (!errorType) {
      return res.json({ message: "Name changed." });
    } else if (errorType === 1) {
      return res.status(400).json({ message: "Name already in use." });
    } else {
      return res.status(400).json({ message: "Database error." });
    }
  }

  // friend management

  @Post("send_friendreq")
  async sendFriendRequest(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.sendFriendReq(thisId, otherId);
  }

  @Post("cancel_friendreq")
  async cancelFriendRequest(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.cancelFriendReq(thisId, otherId);
  }

  @Post("accept_friendreq")
  async acceptFriendRequest(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.acceptFriendReq(thisId, otherId);
  }

  @Post("decline_friendreq")
  async declineFriendRequest(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.declineFriendReq(thisId, otherId);
  }

  @Post("remove_friend")
  async removeFriend(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.removeFriend(thisId, otherId);
  }

  @Post("block_user")
  async blockUser(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.blockUser(thisId, otherId);
  }

  @Post("unblock_user")
  async unblockUser(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.unblockUser(thisId, otherId);
  }
}
