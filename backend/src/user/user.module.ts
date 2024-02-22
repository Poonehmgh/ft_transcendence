import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";
import { ChatGatewayService } from "src/chat/chat.gateway.service";
import { GameQueue } from "src/game/game.queue";

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, GameQueue, ChatGatewayService],
})
export class UserModule {}
