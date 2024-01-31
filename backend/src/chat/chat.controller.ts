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

    @Get(":userID")
    async getChatList(@Param("userID") userID: number) {
        // console.log(userID);
        return this.chatService.getChatList(userID);
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

    @Get(":chatID/participants")
    async getParticipants(@Param("chatID") chatID: number) {
        return this.chatService.getParticipantsByChatID(chatID);
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
