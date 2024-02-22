import {
    ConnectedSocket,
    MessageBody,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatGatewayService } from "./chat.gateway.service";
import { userGateway } from "./userGateway";
import { OnModuleInit } from "@nestjs/common";

// DTO
import {
    ChangeChatUserStatusDTO,
    GameInviteDTO,
    JoinChatDTO,
    SendMessageDTO,
} from "./chat.DTOs";

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
            const userId = Array.isArray(rawUserId)
                ? parseInt(rawUserId[0], 10)
                : parseInt(rawUserId, 10);

            this.chatGatewayService.deleteUserFromList(userId);
            this.chatGatewayService.addUserToList(new userGateway(userId, socket));

            await this.chatGatewayService.setUserSocketId(userId, socket.id);
            await this.chatGatewayService.setUserOnlineStatus(userId, true);

            this.chatGatewayService.printConnectedUsers();
        });
    }

    async handleDisconnect(client: Socket) {
        console.log("handleDisconnect");
        const userID = this.chatGatewayService.getUserIdFromSocket(client);
        if (!userID) return;
        await this.chatGatewayService.setUserOnlineStatus(userID, false);
        this.chatGatewayService.deleteUserFromList(userID);
    }

    @SubscribeMessage("sendMessage")
    async receivingMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: SendMessageDTO
    ) {
        console.log("sendMessage chat socket api: ", message);
        await this.chatGatewayService.addMessageToChat(message);
        // should be optimized to directly send the message to the chat
        // currently, the entire chat is refetched by frontend upon receiving a new message
        await this.chatGatewayService.sendEventToChat(message.chatId, "newMessage");
    }

    // currently not used, because a user can only invite another user upon chat creation
    // and that is handled over API
    // maybe later implement a function to add users to a chat after creation
    // useful, but not required by project
    @SubscribeMessage("chatInvite")
    async InviteUserToChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: JoinChatDTO
    ) {
        console.log("chatInvite (INACTIVE):", message);
        //await this.chatGatewayService.inviteUserToChat(message, client);
    }

    @SubscribeMessage("joinChat")
    async JoinChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: JoinChatDTO
    ) {
        console.log("joinChat:", message);
        await this.chatGatewayService.joinChat(message);
    }

    @SubscribeMessage("changeChatUserStatus")
    async changeUsersInChatStatus(
        @ConnectedSocket() client: Socket,
        @MessageBody() message: ChangeChatUserStatusDTO
    ) {
        console.log("changeChatUserStatus:", message);
        await this.chatGatewayService.changeUsersInChatStatus(message);
    }

    @SubscribeMessage("matchInvite")
    async handleMatchInvite(
        @ConnectedSocket() userSocket: Socket,
        @MessageBody() data: { recipientId: string } | GameInviteDTO
    ) {
        console.log("matchInvite:", data);
        if ("recipientId" in data) {
            try {
                await this.chatGatewayService.inviteUserToMatch(
                    parseInt(data.recipientId),
                    userSocket
                );
            } catch (error) {
                console.error("Error matchInvite:", error);
                userSocket.emit("errorAlert", { message: error.message });
            }
        }
        /*
 
  
      case data.action: acceptInvite
          start local catch block
          get inviterName or throw
          get inviteename or throw
          get socket of inviter or throw
          get socket of invitee or throw
  
          emit to both "matchInvite" with both names and action: matchBeginn
          start countdown for x seconds
          launch game init 
  
          catch
          if sockets
          emit errorAlert to inviter and invitee
  
      case data.action: declineinvite
          start local catch block
          get inviteename or throw
          get socket of inviter or throw
  
          emit matchinvite to inviter with updated inviteename and action:declineinvite
  
  
  
  

      */
    }
}
