import {Socket} from "socket.io";

export class userGateway {
    userID: number;
    socket: Socket;

    constructor(userID: number, socket: Socket) {
        this.userID = userID;
        this.socket = socket;
    }
}
