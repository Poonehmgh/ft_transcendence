import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import {ChatController} from "./chat.controller";
import {PrismaService} from "../prisma/prisma.service";

@Module({
  controllers: [ChatController] ,
  providers: [ChatService, ChatGateway, PrismaService]
})
export class ChatModule {}
