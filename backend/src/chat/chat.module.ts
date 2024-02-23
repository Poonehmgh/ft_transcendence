import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import {ChatController} from "./chat.controller";
import {PrismaService} from "../prisma/prisma.service";
import {ChatGatewayService} from "./chat.gateway.service";
import { UserService } from 'src/user/user.service';
import { GameQueue } from 'src/game/game.queue';

@Module({
  controllers: [ChatController] ,
  providers: [ChatService, ChatGateway, PrismaService, ChatGatewayService, UserService, GameQueue]
})
export class ChatModule {}
