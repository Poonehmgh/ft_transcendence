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
import { UserRelation, IdAndNameDTO, UserProfileDTO, ChangeNameDto } from "./user-dto";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";


interface AuthenticatedRequest extends Request {
    user: any;
}

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    /*     @Post("new")
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
    } */

    @Get("profile/:id")
    async getProfile(@Param("id") id: number): Promise<UserProfileDTO> {
        return this.userService.getProfileById(id);
    }

 

    @Get("my_profile/")
    @UseGuards(JwtAuthGuard)
    async getMyProfile(
        @Req() req: AuthenticatedRequest,
        @Res() res: Response
    ): Promise<UserProfileDTO> {
        console.log("myProfile headers: ", req.headers);
        console.log("myProfile req.user: ", req.user);

        const token = req.headers["token"];
        if (!token) {
            res.status(401).send("Unauthorized");
            return;
        }
        return this.userService.getProfileById(token);
    }

    @Get("get_avatar/:id")
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

    // remove or update to give matchinfodto
    @Get("matches/:id")
    async getMatches(@Param("id") id: number): Promise<number[]> {
        return this.userService.getMatches(id);
    }

    @Get("friendStatus")
    async getFriendStatus(
        @Query("id1") userId: number,
        @Query("id2") otherUserId: number
    ): Promise<UserRelation> {
        return this.userService.getFriendStatus(userId, otherUserId);
    }

    // getters

    @Get("all_users")
    @UseGuards(JwtAuthGuard)
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

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
                        new BadRequestException(
                            "Only JPG, JPEG, PNG, and GIF files are allowed"
                        ),
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
