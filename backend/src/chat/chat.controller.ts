import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    Body,
    UseGuards,
    Req,
    Res,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChatUserDTO, NewChatDTO } from "./chat.DTOs";
import { AuthenticatedRequest } from "src/shared/dto";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    // Getters

    @Get("my_chats")
    async getMyChats(@Req() req: AuthenticatedRequest) {
        return this.chatService.getUsersChats(req.user.id);
    }

    //Give 0,0 for first 50 messages
    @Get(":chatID/messages")
    async getMessageList(
        @Param("chatID") chatID: number,
        @Query("from") from: number,
        @Query("to") to: number
    ) {
        return this.chatService.getMessagesByRange(chatID, from, to);
    }

    @Get("chat_users/:chatId")
    async getChatUsers(@Param("chatId") chatId: number, @Res() res) {
        try {
            const chatUsers: ChatUserDTO[] = await this.chatService.getChatUsers(chatId);
            res.json(chatUsers);
        } catch (error) {
            console.error("Error getChatUsers:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Get("name/:chatId")
    async getChatName(
        @Param("chatId") chatId: number,
        @Req() req: AuthenticatedRequest,
        @Res() res
    ) {
        try {
            const chatName = await this.chatService.getChatName(chatId, req.user.id);
            res.json({ name: chatName });
        } catch (error) {
            console.error("Error getChatName:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // Manipulate chat

    @Post("create")
    async createChat(
        @Req() req: AuthenticatedRequest,
        @Body() newChat: NewChatDTO,
        @Res() res
    ) {
        try {
            const result = await this.chatService.createChat(req.user.id, newChat);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Post("rename/:chatId")
    async renameChat(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: number,
        @Body("name") name: string,
        @Res() res
    ) {
        try {
            const result = await this.chatService.renameChat(req.user.id, chatId, name);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error renaming chat:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Get("remove_password/:chatId")
    async removePassword(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: number,
        @Res() res
    ) {
        try {
            const result = await this.chatService.removePassword(req.user.id, chatId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error removing password:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Post("change_password/:chatId")
    async changePassword(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: number,
        @Body("password") password: string,
        @Res() res
    ) {
        try {
            const result = await this.chatService.changePassword(req.user.id, chatId, password);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error changing password:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // User actions

    @Get("leave/:chatId")
    async leaveChat(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: number,
        @Res() res
    ) {
        try {
            const result = await this.chatService.leaveChat(req.user.id, chatId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error leaving chat:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
