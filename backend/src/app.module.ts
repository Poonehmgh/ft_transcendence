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

import { UploadModule } from "./upload/upload.module";
import { UploadController } from "./upload/upload.controller";
import { UploadService } from "./upload/upload.service";

import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [UserModule, PrismaModule, AuthModule, GameGatewayModule, ChatModule, UploadModule],
  controllers: [AppController, UserController, UploadController],
  providers: [AppService, PrismaService, UserService, UploadService],
})
export class AppModule {}
