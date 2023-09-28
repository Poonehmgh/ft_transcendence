import {Controller, Get, Param, Query} from '@nestjs/common';
import {ChatService} from "./chat.service";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @Get(':userID')
    async getChatList(@Param('userID') userID: number) {
        // console.log(userID);
        return this.chatService.getChatList(userID);
    }

    //Give 0,0 for first 50 messages
    @Get(':chatID/messages')
    async getMessageList(@Param('chatID') chatID: number, @Query('from') from: number, @Query('to') to: number) {
        return this.chatService.getMessagesByRange(chatID, from, to);
    }


    @Get(':chatID/participants')
    async getParticipants(@Param('chatID') chatID: number){
        return this.chatService.getParticipantsByChatID(chatID);
    }

}
