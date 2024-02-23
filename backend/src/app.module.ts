import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";

import { AuthModule } from "./auth/auth.module";

import { GameGatewayModule } from "./game/game.gateway.module";

import { UserModule } from "./user/user.module";
import { UserController } from "./user/user.controller";
import { UserService } from "./user/user.service";

import { ChatModule } from "./chat/chat.module";
import { ChatGatewayService } from "./chat/chat.gateway.service";
import { ChatController } from "./chat/chat.controller";
import { ChatService } from "./chat/chat.service";
import { GameQueue } from "./game/game.queue";

@Module({
    imports: [UserModule, PrismaModule, AuthModule, GameGatewayModule, ChatModule],
    controllers: [AppController, UserController, ChatController],
    providers: [AppService, PrismaService, UserService, ChatService, GameQueue, ChatGatewayService],
})
export class AppModule {}
