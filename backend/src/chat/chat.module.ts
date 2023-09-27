import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import {ChatController} from "./chat.controller";
import {PrismaService} from "../prisma/prisma.service";
import {ChatGatewayService} from "./chat.gateway.service";

@Module({
  controllers: [ChatController] ,
  providers: [ChatService, ChatGateway, PrismaService, ChatGatewayService]
})
export class ChatModule {}
