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
    Put,
    Patch,
    Delete,
} from "@nestjs/common";
import { Response } from "express";
import { UserRelation, IdAndNameDTO, UserProfileDTO, ChangeNameDTO } from "./user-dto";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { MatchDTO } from "src/match/match-dto";
import { reqUser, AuthenticatedRequest } from "src/shared/dto";

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

    @Get("name/:id")
    async getName(@Param("id") id: number, @Res() res) {
        try {
            const name = await this.userService.getNameById(id);
            res.json(name);
        } catch (error) {
            console.error("Error getName:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Get("my_avatar")
    async getMyAvatar(@Req() req: AuthenticatedRequest, @Res() res: Response) {
        console.log("getavatarbyid, id: ", req.user.id);

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

    @Patch("change_name")
    async changeName(
        @Req() req: AuthenticatedRequest,
        @Body() changeNameDTO: ChangeNameDTO,
        @Res() res: Response
    ) {
        try {
            const result = await this.userService.changeName(
                req.user.id,
                changeNameDTO.newName
            );
            if (!result.success) {
                res.status(500).json({ message: result.message });
            } else {
                res.status(200).json({ message: result.message });
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(400).json({ error: error.getResponse() });
            }
            console.error("Error changing name:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Put("my_avatar")
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

    @Post("friendreq")
    async sendFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.sendFriendReq(req.user.id, otherId);
    }

    @Delete("friendreq")
    async cancelFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.cancelFriendReq(req.user.id, otherId);
    }

    @Patch("accept_friendreq")
    async acceptFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.acceptFriendReq(req.user.id, otherId);
    }

    @Patch("decline_friendreq")
    async declineFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.declineFriendReq(req.user.id, otherId);
    }

    @Delete("friend")
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

    @Delete("block")
    async unblockUser(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number }
    ) {
        const { otherId } = body;
        return this.userService.unblockUser(req.user.id, otherId);
    }
}
