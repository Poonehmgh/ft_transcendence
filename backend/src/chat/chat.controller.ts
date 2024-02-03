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
import { NewChatDTO } from "./chat.DTOs";
import { AuthenticatedRequest } from "src/shared/dto";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Get("my_chats")
    async getMyChats(@Req() req: AuthenticatedRequest) {
        return this.chatService.getUserChats(req.user.id);
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
    async getChatUsers(@Param("chatId") chatId: number) {
        return this.chatService.getChatUsers(chatId);
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
            console.error("Error fetching chat name:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Post("create")
    async createChat(
        @Req() req: AuthenticatedRequest,
        @Body() newChat: NewChatDTO,
        @Res() res: Response
    ) {
        return this.chatService.createChat(req.user.id, newChat);
    }
}
