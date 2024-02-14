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

export class MessageDTO {
    id: number;
    timeStamp: Date;
    content: string;
    authorId: number;

    constructor(id: number, timeStamp: Date, content: string, authorId: number) {
        this.id = id;
        this.timeStamp = timeStamp;
        this.content = content;
        this.authorId = authorId;
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
    isPrivate: boolean;
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

export class Chat_ChatUsersDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
    chatUsers: ChatUserDTO[];
}

export class Chat_Complete {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
    messages: MessageDTO[];
    chatUsers: ChatUserDTO[];
}
