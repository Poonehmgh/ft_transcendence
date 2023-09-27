export class ChatListDTO {
    chatName: string;
    chatID: number;

    constructor(chatName: string, chatID: number) {
        this.chatName = chatName;
        this.chatID = chatID;
    }
}

export class MessageListElementDTO {
    id: number;
    content: string;
    author: number;

    constructor(id: number, content: string, author: number) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

export class ParticipantListElementDTO {
    userName: string
    userId: number
    owner: boolean
    admin: boolean
    online: boolean
    pictureUrl: string


    constructor(userName: string, userId: number, owner: boolean, admin: boolean, online: boolean) {
        this.userName = userName;
        this.userId = userId;
        this.owner = owner;
        this.admin = admin;
        this.online = online;
    }
}

export class SendMessageDTO{
    chatID:number;
    userID: number;
    content: string;

    constructor(chatID: number, userID: number, content: string) {
        this.chatID = chatID;
        this.userID = userID;
        this.content = content;
    }
}

export class EstablishConnectDTO{
    userID:number;
}