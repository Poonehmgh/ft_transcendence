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
    UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { UserRelation, IdAndNameDTO, UserProfileDTO, ChangeNameDTO } from "./user-dto";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { MatchDTO } from "src/match/match-dto";
import { reqUser, AuthenticatedRequest} from "src/shared/dto"

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("my_profile")
    async getMyProfile(@Req() req: AuthenticatedRequest): Promise<UserProfileDTO> {
        return this.userService.getProfileById(req.user.id);
    }

    @Get("profile/:id")
    async getProfile(@Param("id") id: number): Promise<UserProfileDTO> {
        return this.userService.getProfileById(id);
    }

    @Get("my_avatar")
    async getMyAvatar(@Req() req: AuthenticatedRequest, @Res() res: Response) {
        const filePath = this.userService.getAvatarPath(req.user.id);
        if (!filePath) {
            return res.sendFile("default.png", { root: "./uploads" });
        }
        return res.sendFile(filePath);
    }

    @Get("avatar/:id")
    async getAvatarById(@Param("id") id: number, @Res() res: Response) {
        const filePath = this.userService.getAvatarPath(id);
        if (!filePath) {
            return res.sendFile("default.png", { root: "./uploads" });
        }
        return res.sendFile(filePath);
    }

    @Get("leaderboard")
    async getTopProfiles(@Query("top") top: number): Promise<UserProfileDTO[]> {
        return this.userService.getTopProfiles(top);
    }

    @Get("matches/:id")
    async getMatches(@Param("id") id: number): Promise<MatchDTO[]> {
        const matchIds = await this.userService.getMatchIds(Number(id));
        return this.userService.getMatchDtos(matchIds);
    }

    @Get("user_relation/:id")
    async getUserRelation(
        @Req() req: AuthenticatedRequest,
        @Param("id") otherId: number
    ): Promise<UserRelation> {
        return this.userService.getFriendStatus(req.user.id, otherId);
    }

    @Get("all_users")
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get("other_users")
    async getOtherUsers(@Req() req: AuthenticatedRequest) {
        return this.userService.getOtherUsers(req.user.id);
    }

    @Get("friends")
    async getFriends(@Req() req: AuthenticatedRequest): Promise<IdAndNameDTO[]> {
        return this.userService.getFriends(req.user.id);
    }

    @Get("blocked")
    async getBlocked(@Req() req: AuthenticatedRequest): Promise<IdAndNameDTO[]> {
        return this.userService.getBlocked(req.user.id);
    }

    @Get("request_in")
    async getRequestIn(@Req() req: AuthenticatedRequest): Promise<IdAndNameDTO[]> {
        return this.userService.getRequestIn(req.user.id);
    }

    @Get("request_out")
    async getRequestOut(@Req() req: AuthenticatedRequest): Promise<IdAndNameDTO[]> {
        return this.userService.getRequestOut(req.user.id);
    }

    // profile management

    @Post("change_name")
    async changeName(
        @Req() req: AuthenticatedRequest,
        @Body() changeNameDTO: ChangeNameDTO,
        @Res() res: Response
    ) {
        const errorType = await this.userService.changeName(
            req.user.id,
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

    @Post("put_avatar")
    @UseInterceptors(
        FileInterceptor("avatar", {
            storage: diskStorage({
                destination: "./uploads",
                filename: (req, file, callback) => {
                    const newFilename =
                        (req.user as reqUser).id + path.extname(file.originalname);
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
                        new BadRequestException(
                            "Only JPG, JPEG, PNG, and GIF files are allowed"
                        ),
                        false
                    );
                }
            },
        })
    )
    async uploadFile(
        @Req() req: AuthenticatedRequest,
        @UploadedFile() file: Express.Multer.File
    ) {
        return { message: "File uploaded successfully", file };
    }

    // friend management

    @Post("send_friendreq")
    async sendFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.sendFriendReq(req.user.id, otherId);
    }

    @Post("cancel_friendreq")
    async cancelFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.cancelFriendReq(req.user.id, otherId);
    }

    @Post("accept_friendreq")
    async acceptFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.acceptFriendReq(req.user.id, otherId);
    }

    @Post("decline_friendreq")
    async declineFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.declineFriendReq(req.user.id, otherId);
    }

    @Post("remove_friend")
    async removeFriend(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.removeFriend(req.user.id, otherId);
    }

    @Post("block")
    async blockUser(@Req() req: AuthenticatedRequest, @Body() body: { otherId: number }) {
        const { otherId } = body;
        return this.userService.blockUser(req.user.id, otherId);
    }

    @Post("unblock")
    async unblockUser(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.unblockUser(req.user.id, otherId);
    }
}
