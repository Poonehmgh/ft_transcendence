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
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChatGatewayService } from "src/chat/chat.gateway.service";

// DTO
import { MatchDTO } from "src/match/match-dto";
import { UserRelation, IdAndNameDTO, UserProfileDTO, ChangeNameDTO, UserStatusDTO } from "./user-dto";
import { reqUser, AuthenticatedRequest } from "src/shared/dto";

@Controller("user")
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly chatGatewayService: ChatGatewayService
    ) {}

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
        return this.userService.getMatches(matchIds);
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
    async getFriends(@Req() req: AuthenticatedRequest): Promise<UserStatusDTO[]> {
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

    @Patch("logout")
    async logout(@Req() req: AuthenticatedRequest, @Res() res: Response) {
        try {
            const result = await this.userService.logout(req.user.id);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error getCompleteChat:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Patch("change_name")
    async changeName(
        @Req() req: AuthenticatedRequest,
        @Body() changeNameDto: ChangeNameDTO,
        @Res() res: Response
    ) {
        try {
            const result = await this.userService.changeName(
                req.user.id,
                changeNameDto.newName
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
        @Body() body: { otherId: number },
        @Res() res: Response
    ) {
        const { otherId } = body;
        try {
            const result = await this.userService.sendFriendReq(req.user.id, otherId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                const updateRecipients = [req.user.id, otherId];
                const data = {
                    event: "sendFriendRequest",
                    from: req.user.id,
                    to: otherId,
                };
                this.chatGatewayService.sendDataEventToList(
                    updateRecipients,
                    "socialUpdate",
                    data
                );
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error sendFriendRequest:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Delete("friendreq")
    async cancelFriendRequest(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number },
        @Res() res: Response
    ) {
        const { otherId } = body;
        try {
            const result = await this.userService.cancelFriendReq(req.user.id, otherId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                const updateRecipients = [req.user.id, otherId];
                const data = {
                    event: "cancelFriendRequest",
                    from: req.user.id,
                    to: otherId,
                };
                this.chatGatewayService.sendDataEventToList(
                    updateRecipients,
                    "socialUpdate",
                    data
                );
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error cancelFriendRequest:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Patch("friendreq")
    async reactToFriendReq(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number; action: string },
        @Res() res: Response
    ) {
        const { otherId, action } = body;
        try {
            let result: any;
            let event: string;
            if (action === "accept") {
                result = await this.userService.acceptFriendReq(req.user.id, otherId);
                event = "acceptFriendRequest";
            } else if (action === "decline") {
                result = await this.userService.declineFriendReq(req.user.id, otherId);
                event = "declineFriendRequest";
            } else {
                return res.status(400).json({ error: "Invalid action" });
            }

            if (result instanceof Error) {
                console.log("about to try to send result.message");
                console.log(result.message);
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                const updateRecipients = [req.user.id, otherId];
                const data = {
                    event: event,
                    from: req.user.id,
                    to: otherId,
                    action: action,
                };
                this.chatGatewayService.sendDataEventToList(
                    updateRecipients,
                    "socialUpdate",
                    data
                );
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error reactToFriendReq:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
        return this.userService.acceptFriendReq(req.user.id, otherId);
    }

    @Delete("friend")
    async removeFriend(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number },
        @Res() res: Response
    ) {
        const { otherId } = body;
        try {
            const result = await this.userService.removeFriend(req.user.id, otherId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                const updateRecipients = [req.user.id, otherId];
                const data = {
                    event: "removeFriend",
                    from: req.user.id,
                    to: otherId,
                };
                this.chatGatewayService.sendDataEventToList(
                    updateRecipients,
                    "socialUpdate",
                    data
                );
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error removeFriend:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Post("block")
    async blockUser(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number },
        @Res() res: Response
    ) {
        const { otherId } = body;
        try {
            const result = await this.userService.blockUser(req.user.id, otherId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                const updateRecipients = [req.user.id, otherId];
                const data = {
                    event: "blockUser",
                    from: req.user.id,
                    to: otherId,
                };
                this.chatGatewayService.sendDataEventToList(
                    updateRecipients,
                    "socialUpdate",
                    data
                );
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error blockUser:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Delete("block")
    async unblockUser(
        @Req() req: AuthenticatedRequest,
        @Body() body: { otherId: number },
        @Res() res: Response
    ) {
        const { otherId } = body;
        try {
            const result = await this.userService.unblockUser(req.user.id, otherId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                const updateRecipients = [req.user.id, otherId];
                const data = {
                    event: "unblockUser",
                    from: req.user.id,
                    to: otherId,
                };
                this.chatGatewayService.sendDataEventToList(
                    updateRecipients,
                    "socialUpdate",
                    data
                );
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error unblockUser:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
