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
  async handleUpdatePlank(@ConnectedSocket() userInfo: Socket, @MessageBody() data : PlankUpdateDTO){
    console.log("on plank update : ", data);
    if (isPlankUpdateDTOValid(data)){
      await this.gameQueue.updatePlankPosition(data);
    }
  }

  @SubscribeMessage('joinQueue')
  async handleJoinMessage(@ConnectedSocket() userSocket: Socket, @MessageBody() data : JoinGameDTO){
    if(!isJoinGameDTOValid(data))
        return;
    console.log(data.userID);
    await this.gameQueue.addPlayerToQueue(new userGateway(data.userID, userSocket));
  }
}
