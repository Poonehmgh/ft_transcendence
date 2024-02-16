import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
    ChangeChatUserStatusDTO,
    CreateNewChatDTO,
    NewChatDTO,
    EstablishConnectDTO,
    InviteUserDTO,
    SendMessageDTO,
} from "./chat.DTOs";
import { ChatGatewayService } from "./chat.gateway.service";
import { userGateway } from "./userGateway";
import { OnModuleInit } from "@nestjs/common";
import { connect } from "http2";

@WebSocketGateway()
export class ChatGateway implements OnModuleInit, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly chatGatewayService: ChatGatewayService) {}

    async onModuleInit() {
        await this.chatGatewayService.setAllUsersOffline();
        console.log("Starting chat gateway");

        this.server.on("connection", async (socket) => {
            console.log(`Client ${socket.id} got connected to chat gateway`);
            
            const rawUserId = socket.handshake.query.userId;
            const userId = Array.isArray(rawUserId) ? parseInt(rawUserId[0], 10) : parseInt(rawUserId, 10);
            
            this.chatGatewayService.deleteUserFromList(userId);
            this.chatGatewayService.addUserToList(new userGateway(userId, socket));
            await this.chatGatewayService.setUserSocketId(userId, socket.id);
            await this.chatGatewayService.setUserOnlineStatus(userId, true);

            this.chatGatewayService.printConnectedUsers();
        });
    }

    async handleDisconnect(client: Socket) {
        console.log("handleDisconnect called");
        const userID = this.chatGatewayService.getUserIdFromSocket(client);
        if (!userID) return;
        await this.chatGatewayService.setUserOnlineStatus(userID, false);
        this.chatGatewayService.deleteUserFromList(userID);
    }


    // fixed filterfunction and added this to intial connect.
    // sending a connectMessage is now obsolete.
 /*    @SubscribeMessage("connectMessage")
    async establishConnect(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: EstablishConnectDTO
    ) {
        this.chatGatewayService.addUserToList(new userGateway(data.userID, client));
        await this.chatGatewayService.setUserSocketId(data.userID, client.id);
        await this.chatGatewayService.setUserOnlineStatus(data.userID, true);
    } */

    @SubscribeMessage("sendMessage")
    async receivingMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: SendMessageDTO
    ) {
        console.log("sendMessage chat socket api: ", message);
        const messageID: number = await this.chatGatewayService.addMessageToChat(message);
        await this.chatGatewayService.sendUpdateMessages(messageID, message);
    }

    // moved to API
    /*   @SubscribeMessage('createChat')
	  async newChatMessage(@ConnectedSocket() client: Socket, @MessageBody()message: NewChatDTO){
		const chat = await this.chatGatewayService.createNewEmptyChat(message);
		if(chat)
		  await this.chatGatewayService.sendChatCreationUpdate(chat);
	  } */

    @SubscribeMessage("inviteUser")
    async InviteUserToChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: InviteUserDTO
    ) {
        await this.chatGatewayService.inviteUserToChat(message, client);
    }

    @SubscribeMessage("changeChatUserStatus")
    async changeUsersInChatStatus(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: ChangeChatUserStatusDTO
    ) {
        console.log(message);
        await this.chatGatewayService.changeUsersInChatStatus(message);
    }
}
