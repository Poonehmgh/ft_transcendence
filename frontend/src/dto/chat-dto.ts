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
    userName: string;
    userId: number;
    owner: boolean;
    admin: boolean;
    online: boolean;
    pictureUrl: string;

    constructor(
        userName: string,
        userId: number,
        owner: boolean,
        admin: boolean,
        online: boolean
    ) {
        this.userName = userName;
        this.userId = userId;
        this.owner = owner;
        this.admin = admin;
        this.online = online;
    }
}

export class SendMessageDTO {
    chatId: number;
    userId: number;
    content: string;

    constructor(chatID: number, userID: number, content: string) {
        this.chatId = chatID;
        this.userId = userID;
        this.content = content;
    }
}

export class EstablishConnectDTO {
    userID: number;
}

export class ChatUserDTO {
    userId: number;
    chatId: number;
    owner: boolean;
    admin: boolean;
    blocked: boolean;
    muted: boolean;
    invited: boolean;
}

export class NewChatDTO {
    dm: boolean;
    private: boolean;
    password?: string = null;
    userIds: number[];
}

export class InviteUserDTO {
    chatId: number;
    userId: number;

    constructor(chatID: number, userId: number) {
        this.chatId = chatID;
        this.userId = userId;
    }
}

export class ChatInfoDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
    chatUsers: ChatUserDTO[];
}
