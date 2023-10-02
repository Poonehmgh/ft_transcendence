import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Req,
  Res,
  Param,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from "@nestjs/common";
import { Response } from "express";
import {
  UserRelation,
  IdAndNameDTO,
  NewUserDTO,
  ScoreCardDTO,
  UserProfileDTO,
  ChangeNameDto,
} from "./user-dto";
import { UserService } from "./user.service";
import * as fs from "fs";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";

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

  @Get("get_avatar/:id")
  async getMyAvatar(@Param("id") id: number, @Res() res: Response) {
    const filePath = this.userService.getAvatarPath(id);
    if (!filePath) {
      return res.sendFile("default.jpg", { root: "./uploads" });
    }
    return res.sendFile(filePath);
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

  // getters

  @Get("friends/:id")
  async getFriends(@Param("id") id: number): Promise<IdAndNameDTO[]> {
    return this.userService.getFriends(id);
  }

  @Get("blocked/:id")
  async getBlocked(@Param("id") id: number): Promise<IdAndNameDTO[]> {
    return this.userService.getBlocked(id);
  }

  @Get("request_in/:id")
  async getRequestIn(@Param("id") id: number): Promise<IdAndNameDTO[]> {
    return this.userService.getRequestIn(id);
  }

  @Get("request_out/:id")
  async getRequestOut(@Param("id") id: number): Promise<IdAndNameDTO[]> {
    return this.userService.getRequestOut(id);
  }

  // profile management

  @Post("change_name")
  async changeName(@Body() changeNameDTO: ChangeNameDto, @Res() res: Response) {
    const errorType = await this.userService.changeName(
      changeNameDTO.id,
      changeNameDTO.newName
    );
    // 0 = no error; 1 = uniqueness constraint violation; 2 = any other error
    if (!errorType) {
      return res.json({ message: "Name changed." });
    } else if (errorType === 1) {
      return res.status(400).json({ message: "Name already in use." });
    } else {
      return res.status(400).json({ message: "Database error." });
    }
  }

  @Post("put_avatar/:id")
  @UseInterceptors(
    FileInterceptor("avatar", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const newFilename = req.params.id + path.extname(file.originalname);
          callback(null, newFilename);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, callback) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(fileExtension)) {
          callback(null, true);
        } else {
          return callback(
            new BadRequestException("Only JPG, JPEG, PNG, and GIF files are allowed"),
            false
          );
        }
      },
    })
  )
  async uploadFile(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
    return { message: "File uploaded successfully", file };
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

  @Post("block")
  async blockUser(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.blockUser(thisId, otherId);
  }

  @Post("unblock")
  async unblockUser(@Body() body: { thisId: number; otherId: number }) {
    const { thisId } = body;
    const { otherId } = body;
    return this.userService.unblockUser(thisId, otherId);
  }
}
