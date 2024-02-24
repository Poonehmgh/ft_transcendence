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
    Patch,
    BadRequestException,
} from "@nestjs/common";
import { Response } from "express";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChatUserDTO, NewChatDTO } from "./chat.DTOs";
import { AuthenticatedRequest } from "src/shared/dto";
import { ChatGatewayService } from "./chat.gateway.service";
import { ChangeNameDTO } from "src/user/user-dto";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly chatGatewayService: ChatGatewayService
    ) {}

    // Getters

    @Get("my_chats")
    async getMyChats(@Req() req: AuthenticatedRequest, @Res() res) {
        try {
            const result = await this.chatService.getUsersChats(req.user.id);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error getLatestMessages:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Get("public_chats")
    async getPublicChats(@Req() req: AuthenticatedRequest, @Res() res) {
        try {
            const result = await this.chatService.getPublicChats(req.user.id);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error getPublicChats:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Get("latest_messages/:chatId")
    async getLatestMessages(@Param("chatId") chatId: number, @Res() res) {
        try {
            const result = await this.chatService.getLatestMessages(chatId);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error getLatestMessages:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
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

    @Get("complete_chat/:chatId")
    async getCompleteChat(
        @Param("chatId") chatId: number,
        @Req() req: AuthenticatedRequest,
        @Res() res
    ) {
        try {
            const result = await this.chatService.getCompleteChat(chatId, req.user.id);
            if (result instanceof Error) {
                if (result.message === "User is not part of this chat") {
                    res.status(403).json({ error: result.message });
                } else {
                    res.status(500).json({ error: result.message });
                }
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error getCompleteChat:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    //Give 0,0 for first 50 messages
    @Get(":chatId/messages")
    async getMessageList(
        @Param("chatId") chatId: number,
        @Query("from") from: number,
        @Query("to") to: number
    ) {
        return this.chatService.getMessagesByRange(chatId, from, to);
    }

    // Manipulate chat

    @Post("create")
    async createChat(
        @Req() req: AuthenticatedRequest,
        @Body() newChat: NewChatDTO,
        @Res() res: Response
    ) {
        try {
            const result = await this.chatService.createChat(req.user.id, newChat);
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                this.chatGatewayService.sendEventToChat(result.id, "updateChat");
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error createChat Controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Patch("rename/:chatId")
    async renameChat(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: number,
        @Body() changeNameDto: ChangeNameDTO,
        @Res() res: Response
    ) {
        console.log("renameChat called.");
        console.log("body:", Body);
        try {
            const result = await this.chatService.renameChat(
                req.user.id,
                chatId,
                changeNameDto.newName
            );
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                this.chatGatewayService.sendEventToChat(chatId, "updateChat");
                res.status(200).json(result);
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                return res.status(400).json({ error: error.getResponse() });
            }
            console.error("Error renameChat:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Patch("remove_password/:chatId")
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
            console.error("Error removePassword:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    @Patch("change_password/:chatId")
    async changePassword(
        @Req() req: AuthenticatedRequest,
        @Param("chatId") chatId: number,
        @Body("password") password: string,
        @Res() res
    ) {
        try {
            const result = await this.chatService.changePassword(
                req.user.id,
                chatId,
                password
            );
            if (result instanceof Error) {
                res.status(500).json({ error: result.message });
            } else if ("error" in result) {
                res.status(500).json({ error: result.error });
            } else {
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error changePassword:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    // User actions

    @Patch("leave/:chatId")
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
                this.chatGatewayService.sendEventToChat(chatId, "updateChat");
                res.status(200).json(result);
            }
        } catch (error) {
            console.error("Error leaveChat:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
