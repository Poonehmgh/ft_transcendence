import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";
import { ChatGatewayService } from "src/chat/chat.gateway.service";

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, ChatGatewayService],
})
export class UserModule {}
