import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {OnModuleInit} from "@nestjs/common";
import {GameQueue, userGateway} from "./game.queue";
import {isJoinGameDTOValid, isPlankUpdateDTOValid, JoinGameDTO, PlankUpdateDTO} from "./game.DTOs";

@WebSocketGateway(
    {
      cors: {
        origins: '*',
      },
    }
)
export class GameGateway implements OnModuleInit{
  constructor(private gameQueue : GameQueue) {}
  @WebSocketServer()
  server: Server

  onModuleInit(): any {
    console.log('Starting game gateway');
    this.server.on('connection', (socket) => {
      console.log(`Client ${socket.id} got connected`)
    });
  }


  @SubscribeMessage('updatePlank')
  handleUpdatePlank(@ConnectedSocket() userInfo: Socket, @MessageBody() data : PlankUpdateDTO){
    console.log(data);
    if (isPlankUpdateDTOValid(data)){
      this.gameQueue.updatePlankPosition(data);
    }
  }

  @SubscribeMessage('joinQueue')
  async handleJoinMessage(@ConnectedSocket() userSocket: Socket, @MessageBody() data : JoinGameDTO){
    if(!isJoinGameDTOValid(data))
        return;
    console.log(data.userID);
    await this.gameQueue.addPlayerToQueue(new userGateway(data.userID, userSocket));
  }

  @SubscribeMessage("matchInvite")
  async handleMatchInvite(@ConnectedSocket() userSocket: Socket, @MessageBody() data : {recipientId: string} | any) {
	/*
	case data.action: invite
		start local catch block
		invitee must exist or throw
		invitee must be online or throw
		invitee must not have inviter blocked or throw

		then get inviterName or throw
		update payload with inviterName
		
		then get inviteesocket or throw

		emit "matchInvite" to invitee, same payload but with inviterName updated
		
		catch
			emit errorAlert to inviter

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





	export class GameInviteDTO {
	inviterId: number;
	inviterName: string;
	inviteeId: number;
	inviteeName: string;
	action: gameInviteAction;
}

enum gameInviteAction {
	invite,
	acceptInvite,
	declineInvite,
	matchBeginn
}
	*/

  }
}
